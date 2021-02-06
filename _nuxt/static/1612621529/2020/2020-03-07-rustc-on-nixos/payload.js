__NUXT_JSONP__("/2020/2020-03-07-rustc-on-nixos", {data:[{article:Object.create(null,{default:{writable:true,enumerable:true,value:{title:"rustc-1.41.1 on nixOS",subtitle:"especially for macOS",date:"2020-03-19T00:00:00.000Z",tags:["Rust","nixOS"],bodyContent:"sat-benchのバージョン上げる際にRust 1.41での新しい構文を使ったせいでrustc-1.41が必須になってしまった。\nそんなことは全然問題ないかと思ったらnixpkgsでの標準のRustPlatformの使用バージョンが1.37だったのでま\nずrustc-1.41を指定することが必要になった。ところがrustc-1.41がコンパイルできない。\nllvmのリンカがAMDGPUなんたらが見つからないというエラーが出る。時間を作って調べてみた。\n\n結論から言うと、\n\n1. [nixpkgs](https:\u002F\u002Fgithub.com\u002FNixOS\u002Fnixpkgs)をcloneして適当な新しめのブランチ（例えばnixpkgs-unstable）をcheckout。\n1. top directoryで `nix-build -A rustc-1.41` を実行すると問題なく生成できる\n1. なので\n   [pkgs\u002Fdevelopment\u002Fcompilers\u002Frust\u002F1_41_0.nix](https:\u002F\u002Fgithub.com\u002FNixOS\u002Fnixpkgs\u002Ftree\u002Fmaster\u002Fpkgs\u002Fdevelopment\u002Fcompilers\u002Frust\u002F)\n   で`rustcVersion`を\"1.41.1\"に変更（`rustcSha256`は変更してないのだが。。。）してbuildする\n1. 生成できたら同じディレクトリで`nix-build -A sat-bench`\n1. 生成できたら `nix-env -i path-to-the-derivation`を実行してインストール\n\nこれでOK。これまで`NIXPKGS`環境変数とかで指定したつもりだったのだが`nix-build`の利用が正解だったようだ。\n\n\n## 参考\n\n- [https:\u002F\u002Fnixos.wiki\u002Fwiki\u002FNixpkgs](https:\u002F\u002Fnixos.wiki\u002Fwiki\u002FNixpkgs)\n\n## 2020-03-19: スナップショット\n\nRust-1.42にバージョンアップ。\n\n```\ndiff --git a\u002Fpkgs\u002Fdevelopment\u002Fcompilers\u002Frust\u002F1_41_0.nix b\u002Fpkgs\u002Fdevelopment\u002Fcompilers\u002Frust\u002F1_41_0.nix\ndeleted file mode 100644\nindex b73d9b8ef26..00000000000\n--- a\u002Fpkgs\u002Fdevelopment\u002Fcompilers\u002Frust\u002F1_41_0.nix\n+++ \u002Fdev\u002Fnull\n@@ -1,48 +0,0 @@\n-# New rust versions should first go to staging.\n-# Things to check after updating:\n-# 1. Rustc should produce rust binaries on x86_64-linux, aarch64-linux and x86_64-darwin:\n-#    i.e. nix-shell -p fd or @GrahamcOfBorg build fd on github\n-#    This testing can be also done by other volunteers as part of the pull\n-#    request review, in case platforms cannot be covered.\n-# 2. The LLVM version used for building should match with rust upstream.\n-# 3. Firefox and Thunderbird should still build on x86_64-linux.\n-\n-{ stdenv, lib\n-, buildPackages\n-, newScope, callPackage\n-, CoreFoundation, Security\n-, llvmPackages_5\n-, pkgsBuildTarget, pkgsBuildBuild\n-, fetchpatch\n-} @ args:\n-\n-import .\u002Fdefault.nix {\n-  rustcVersion = \"1.41.0\";\n-  rustcSha256 = \"0jypz2mrzac41sj0zh07yd1z36g2s2rvgsb8g624sk4l14n84ijm\";\n-\n-  # Note: the version MUST be one version prior to the version we're\n-  # building\n-  bootstrapVersion = \"1.40.0\";\n-\n-  # fetch hashes by running `print-hashes.sh 1.40.0`\n-  bootstrapHashes = {\n-    i686-unknown-linux-gnu = \"d050d3a1c7c45ba9c50817d45bf6d7dd06e1a4d934f633c8096b7db6ae27adc1\";\n-    x86_64-unknown-linux-gnu = \"fc91f8b4bd18314e83a617f2389189fc7959146b7177b773370d62592d4b07d0\";\n-    arm-unknown-linux-gnueabihf = \"4be9949c4d3c572b69b1df61c3506a3a3ac044851f025d38599612e7caa933c5\";\n-    armv7-unknown-linux-gnueabihf = \"ebfe3978e12ffe34276272ee6d0703786249a9be80ca50617709cbfdab557306\";\n-    aarch64-unknown-linux-gnu = \"639271f59766d291ebdade6050e7d05d61cb5c822a3ef9a1e2ab185fed68d729\";\n-    i686-apple-darwin = \"ea189b1fb0bfda367cde6d43c18863ab4c64ffca04265e5746bf412a186fe1a2\";\n-    x86_64-apple-darwin = \"749ca5e0b94550369cc998416b8854c13157f5d11d35e9b3276064b6766bcb83\";\n-  };\n-\n-  selectRustPackage = pkgs: pkgs.rust_1_41_0;\n-\n-  rustcPatches = [\n-    (fetchpatch {\n-      url = \"https:\u002F\u002Fgithub.com\u002FQuiltOS\u002Frust\u002Fcommit\u002Ff1803452b9e95bfdbc3b8763138b9f92c7d12b46.diff\";\n-      sha256 = \"1mzxaj46bq7ll617wg0mqnbnwr1da3hd4pbap8bjwhs3kfqnr7kk\";\n-    })\n-  ];\n-}\n-\n-(builtins.removeAttrs args [ \"fetchpatch\" ])\ndiff --git a\u002Fpkgs\u002Fdevelopment\u002Fcompilers\u002Frust\u002F1_42_0.nix b\u002Fpkgs\u002Fdevelopment\u002Fcompilers\u002Frust\u002F1_42_0.nix\nnew file mode 100644\nindex 00000000000..fd2eaa79868\n--- \u002Fdev\u002Fnull\n+++ b\u002Fpkgs\u002Fdevelopment\u002Fcompilers\u002Frust\u002F1_42_0.nix\n@@ -0,0 +1,48 @@\n+# New rust versions should first go to staging.\n+# Things to check after updating:\n+# 1. Rustc should produce rust binaries on x86_64-linux, aarch64-linux and x86_64-darwin:\n+#    i.e. nix-shell -p fd or @GrahamcOfBorg build fd on github\n+#    This testing can be also done by other volunteers as part of the pull\n+#    request review, in case platforms cannot be covered.\n+# 2. The LLVM version used for building should match with rust upstream.\n+# 3. Firefox and Thunderbird should still build on x86_64-linux.\n+\n+{ stdenv, lib\n+, buildPackages\n+, newScope, callPackage\n+, CoreFoundation, Security\n+, llvmPackages_5\n+, pkgsBuildTarget, pkgsBuildBuild\n+, fetchpatch\n+} @ args:\n+\n+import .\u002Fdefault.nix {\n+  rustcVersion = \"1.42.0\";\n+  rustcSha256 = \"0x9lxs82may6c0iln0b908cxyn1cv7h03n5cmbx3j1bas4qzks6j\";\n+\n+  # Note: the version MUST be one version prior to the version we're\n+  # building\n+  bootstrapVersion = \"1.41.1\";\n+\n+  # fetch hashes by running `print-hashes.sh 1.41.1`\n+  bootstrapHashes = {\n+    i686-unknown-linux-gnu = \"085c8880ee635c2182504a1f2aaa2865455f9ff43511b3976a2140a8bfcce6f3\";\n+    x86_64-unknown-linux-gnu = \"a6d5a3b3f574aafc8f787fea37aad9fb8a7946b383ae5348146927192ff0bef0\";\n+    arm-unknown-linux-gnueabihf = \"210090e13970646707325fc0270ef368cde3e2a4a7671f2cf374f57fcc8e3770\";\n+    armv7-unknown-linux-gnueabihf = \"531e4006fee503ba1581c3feca2932f99d0df97bc2361e33fa028e3d7060ccc1\";\n+    aarch64-unknown-linux-gnu = \"d54c0f9165b86216b6f1b499f451141407939c5dc6b36c89a3772895a1370242\";\n+    i686-apple-darwin = \"727cbbfa58a2698d577c99f2a221512bff6ba07ca98ec47cf7ec5043eca60c81\";\n+    x86_64-apple-darwin = \"16615288cf74239783de1b435d329f3d56ed13803c7c10cd4b207d7c8ffa8f67\";\n+  };\n+\n+  selectRustPackage = pkgs: pkgs.rust_1_42_0;\n+\n+#  rustcPatches = [\n+#    (fetchpatch {\n+#      url = \"https:\u002F\u002Fgithub.com\u002FQuiltOS\u002Frust\u002Fcommit\u002Ff1803452b9e95bfdbc3b8763138b9f92c7d12b46.diff\";\n+#      sha256 = \"1mzxaj46bq7ll617wg0mqnbnwr1da3hd4pbap8bjwhs3kfqnr7kk\";\n+#    })\n+#  ];\n+}\n+\n+(builtins.removeAttrs args [ \"fetchpatch\" ])\ndiff --git a\u002Fpkgs\u002Ftop-level\u002Fall-packages.nix b\u002Fpkgs\u002Ftop-level\u002Fall-packages.nix\nindex 60da1eeaf5b..2d435f022e4 100644\n--- a\u002Fpkgs\u002Ftop-level\u002Fall-packages.nix\n+++ b\u002Fpkgs\u002Ftop-level\u002Fall-packages.nix\n@@ -8846,13 +8846,13 @@ in\n     inherit (darwin) apple_sdk;\n   };\n \n-  rust_1_41_0 = callPackage ..\u002Fdevelopment\u002Fcompilers\u002Frust\u002F1_41_0.nix {\n+  rust_1_42_0 = callPackage ..\u002Fdevelopment\u002Fcompilers\u002Frust\u002F1_42_0.nix {\n     inherit (darwin.apple_sdk.frameworks) CoreFoundation Security;\n   };\n-  rust = rust_1_41_0;\n+  rust = rust_1_42_0;\n \n-  rustPackages_1_41_0 = rust_1_41_0.packages.stable;\n-  rustPackages = rustPackages_1_41_0;\n+  rustPackages_1_42_0 = rust_1_42_0.packages.stable;\n+  rustPackages = rustPackages_1_42_0;\n \n   inherit (rustPackages) cargo clippy rustc rustPlatform;\n   inherit (rust) makeRustPlatform;\n@@ -21946,6 +21946,7 @@ in\n \n   thunderbird = callPackage ..\u002Fapplications\u002Fnetworking\u002Fmailreaders\u002Fthunderbird {\n     inherit (gnome2) libIDL;\n+    inherit (rustPackages_1_42_0) cargo rustc;\n     libpng = libpng_apng;\n     gtk3Support = true;\n   };\n```",bodyHtml:"\u003Cp\u003Esat-benchのバージョン上げる際にRust 1.41での新しい構文を使ったせいでrustc-1.41が必須になってしまった。\nそんなことは全然問題ないかと思ったらnixpkgsでの標準のRustPlatformの使用バージョンが1.37だったのでま\nずrustc-1.41を指定することが必要になった。ところがrustc-1.41がコンパイルできない。\nllvmのリンカがAMDGPUなんたらが見つからないというエラーが出る。時間を作って調べてみた。\u003C\u002Fp\u003E\n\u003Cp\u003E結論から言うと、\u003C\u002Fp\u003E\n\u003Col\u003E\n\u003Cli\u003E\u003Ca href=\"https:\u002F\u002Fgithub.com\u002FNixOS\u002Fnixpkgs\"\u003Enixpkgs\u003C\u002Fa\u003Eをcloneして適当な新しめのブランチ（例えばnixpkgs-unstable）をcheckout。\u003C\u002Fli\u003E\n\u003Cli\u003Etop directoryで \u003Ccode\u003Enix-build -A rustc-1.41\u003C\u002Fcode\u003E を実行すると問題なく生成できる\u003C\u002Fli\u003E\n\u003Cli\u003Eなので\n\u003Ca href=\"https:\u002F\u002Fgithub.com\u002FNixOS\u002Fnixpkgs\u002Ftree\u002Fmaster\u002Fpkgs\u002Fdevelopment\u002Fcompilers\u002Frust\u002F\"\u003Epkgs\u002Fdevelopment\u002Fcompilers\u002Frust\u002F1_41_0.nix\u003C\u002Fa\u003E\nで\u003Ccode\u003ErustcVersion\u003C\u002Fcode\u003Eを&quot;1.41.1&quot;に変更（\u003Ccode\u003ErustcSha256\u003C\u002Fcode\u003Eは変更してないのだが。。。）してbuildする\u003C\u002Fli\u003E\n\u003Cli\u003E生成できたら同じディレクトリで\u003Ccode\u003Enix-build -A sat-bench\u003C\u002Fcode\u003E\u003C\u002Fli\u003E\n\u003Cli\u003E生成できたら \u003Ccode\u003Enix-env -i path-to-the-derivation\u003C\u002Fcode\u003Eを実行してインストール\u003C\u002Fli\u003E\n\u003C\u002Fol\u003E\n\u003Cp\u003EこれでOK。これまで\u003Ccode\u003ENIXPKGS\u003C\u002Fcode\u003E環境変数とかで指定したつもりだったのだが\u003Ccode\u003Enix-build\u003C\u002Fcode\u003Eの利用が正解だったようだ。\u003C\u002Fp\u003E\n\u003Ch2\u003E参考\u003C\u002Fh2\u003E\n\u003Cul\u003E\n\u003Cli\u003E\u003Ca href=\"https:\u002F\u002Fnixos.wiki\u002Fwiki\u002FNixpkgs\"\u003Ehttps:\u002F\u002Fnixos.wiki\u002Fwiki\u002FNixpkgs\u003C\u002Fa\u003E\u003C\u002Fli\u003E\n\u003C\u002Ful\u003E\n\u003Ch2\u003E2020-03-19: スナップショット\u003C\u002Fh2\u003E\n\u003Cp\u003ERust-1.42にバージョンアップ。\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode\u003Ediff --git a\u002Fpkgs\u002Fdevelopment\u002Fcompilers\u002Frust\u002F1_41_0.nix b\u002Fpkgs\u002Fdevelopment\u002Fcompilers\u002Frust\u002F1_41_0.nix\ndeleted file mode 100644\nindex b73d9b8ef26..00000000000\n--- a\u002Fpkgs\u002Fdevelopment\u002Fcompilers\u002Frust\u002F1_41_0.nix\n+++ \u002Fdev\u002Fnull\n@@ -1,48 +0,0 @@\n-# New rust versions should first go to staging.\n-# Things to check after updating:\n-# 1. Rustc should produce rust binaries on x86_64-linux, aarch64-linux and x86_64-darwin:\n-#    i.e. nix-shell -p fd or @GrahamcOfBorg build fd on github\n-#    This testing can be also done by other volunteers as part of the pull\n-#    request review, in case platforms cannot be covered.\n-# 2. The LLVM version used for building should match with rust upstream.\n-# 3. Firefox and Thunderbird should still build on x86_64-linux.\n-\n-{ stdenv, lib\n-, buildPackages\n-, newScope, callPackage\n-, CoreFoundation, Security\n-, llvmPackages_5\n-, pkgsBuildTarget, pkgsBuildBuild\n-, fetchpatch\n-} @ args:\n-\n-import .\u002Fdefault.nix {\n-  rustcVersion = &quot;1.41.0&quot;;\n-  rustcSha256 = &quot;0jypz2mrzac41sj0zh07yd1z36g2s2rvgsb8g624sk4l14n84ijm&quot;;\n-\n-  # Note: the version MUST be one version prior to the version we're\n-  # building\n-  bootstrapVersion = &quot;1.40.0&quot;;\n-\n-  # fetch hashes by running `print-hashes.sh 1.40.0`\n-  bootstrapHashes = {\n-    i686-unknown-linux-gnu = &quot;d050d3a1c7c45ba9c50817d45bf6d7dd06e1a4d934f633c8096b7db6ae27adc1&quot;;\n-    x86_64-unknown-linux-gnu = &quot;fc91f8b4bd18314e83a617f2389189fc7959146b7177b773370d62592d4b07d0&quot;;\n-    arm-unknown-linux-gnueabihf = &quot;4be9949c4d3c572b69b1df61c3506a3a3ac044851f025d38599612e7caa933c5&quot;;\n-    armv7-unknown-linux-gnueabihf = &quot;ebfe3978e12ffe34276272ee6d0703786249a9be80ca50617709cbfdab557306&quot;;\n-    aarch64-unknown-linux-gnu = &quot;639271f59766d291ebdade6050e7d05d61cb5c822a3ef9a1e2ab185fed68d729&quot;;\n-    i686-apple-darwin = &quot;ea189b1fb0bfda367cde6d43c18863ab4c64ffca04265e5746bf412a186fe1a2&quot;;\n-    x86_64-apple-darwin = &quot;749ca5e0b94550369cc998416b8854c13157f5d11d35e9b3276064b6766bcb83&quot;;\n-  };\n-\n-  selectRustPackage = pkgs: pkgs.rust_1_41_0;\n-\n-  rustcPatches = [\n-    (fetchpatch {\n-      url = &quot;https:\u002F\u002Fgithub.com\u002FQuiltOS\u002Frust\u002Fcommit\u002Ff1803452b9e95bfdbc3b8763138b9f92c7d12b46.diff&quot;;\n-      sha256 = &quot;1mzxaj46bq7ll617wg0mqnbnwr1da3hd4pbap8bjwhs3kfqnr7kk&quot;;\n-    })\n-  ];\n-}\n-\n-(builtins.removeAttrs args [ &quot;fetchpatch&quot; ])\ndiff --git a\u002Fpkgs\u002Fdevelopment\u002Fcompilers\u002Frust\u002F1_42_0.nix b\u002Fpkgs\u002Fdevelopment\u002Fcompilers\u002Frust\u002F1_42_0.nix\nnew file mode 100644\nindex 00000000000..fd2eaa79868\n--- \u002Fdev\u002Fnull\n+++ b\u002Fpkgs\u002Fdevelopment\u002Fcompilers\u002Frust\u002F1_42_0.nix\n@@ -0,0 +1,48 @@\n+# New rust versions should first go to staging.\n+# Things to check after updating:\n+# 1. Rustc should produce rust binaries on x86_64-linux, aarch64-linux and x86_64-darwin:\n+#    i.e. nix-shell -p fd or @GrahamcOfBorg build fd on github\n+#    This testing can be also done by other volunteers as part of the pull\n+#    request review, in case platforms cannot be covered.\n+# 2. The LLVM version used for building should match with rust upstream.\n+# 3. Firefox and Thunderbird should still build on x86_64-linux.\n+\n+{ stdenv, lib\n+, buildPackages\n+, newScope, callPackage\n+, CoreFoundation, Security\n+, llvmPackages_5\n+, pkgsBuildTarget, pkgsBuildBuild\n+, fetchpatch\n+} @ args:\n+\n+import .\u002Fdefault.nix {\n+  rustcVersion = &quot;1.42.0&quot;;\n+  rustcSha256 = &quot;0x9lxs82may6c0iln0b908cxyn1cv7h03n5cmbx3j1bas4qzks6j&quot;;\n+\n+  # Note: the version MUST be one version prior to the version we're\n+  # building\n+  bootstrapVersion = &quot;1.41.1&quot;;\n+\n+  # fetch hashes by running `print-hashes.sh 1.41.1`\n+  bootstrapHashes = {\n+    i686-unknown-linux-gnu = &quot;085c8880ee635c2182504a1f2aaa2865455f9ff43511b3976a2140a8bfcce6f3&quot;;\n+    x86_64-unknown-linux-gnu = &quot;a6d5a3b3f574aafc8f787fea37aad9fb8a7946b383ae5348146927192ff0bef0&quot;;\n+    arm-unknown-linux-gnueabihf = &quot;210090e13970646707325fc0270ef368cde3e2a4a7671f2cf374f57fcc8e3770&quot;;\n+    armv7-unknown-linux-gnueabihf = &quot;531e4006fee503ba1581c3feca2932f99d0df97bc2361e33fa028e3d7060ccc1&quot;;\n+    aarch64-unknown-linux-gnu = &quot;d54c0f9165b86216b6f1b499f451141407939c5dc6b36c89a3772895a1370242&quot;;\n+    i686-apple-darwin = &quot;727cbbfa58a2698d577c99f2a221512bff6ba07ca98ec47cf7ec5043eca60c81&quot;;\n+    x86_64-apple-darwin = &quot;16615288cf74239783de1b435d329f3d56ed13803c7c10cd4b207d7c8ffa8f67&quot;;\n+  };\n+\n+  selectRustPackage = pkgs: pkgs.rust_1_42_0;\n+\n+#  rustcPatches = [\n+#    (fetchpatch {\n+#      url = &quot;https:\u002F\u002Fgithub.com\u002FQuiltOS\u002Frust\u002Fcommit\u002Ff1803452b9e95bfdbc3b8763138b9f92c7d12b46.diff&quot;;\n+#      sha256 = &quot;1mzxaj46bq7ll617wg0mqnbnwr1da3hd4pbap8bjwhs3kfqnr7kk&quot;;\n+#    })\n+#  ];\n+}\n+\n+(builtins.removeAttrs args [ &quot;fetchpatch&quot; ])\ndiff --git a\u002Fpkgs\u002Ftop-level\u002Fall-packages.nix b\u002Fpkgs\u002Ftop-level\u002Fall-packages.nix\nindex 60da1eeaf5b..2d435f022e4 100644\n--- a\u002Fpkgs\u002Ftop-level\u002Fall-packages.nix\n+++ b\u002Fpkgs\u002Ftop-level\u002Fall-packages.nix\n@@ -8846,13 +8846,13 @@ in\n     inherit (darwin) apple_sdk;\n   };\n \n-  rust_1_41_0 = callPackage ..\u002Fdevelopment\u002Fcompilers\u002Frust\u002F1_41_0.nix {\n+  rust_1_42_0 = callPackage ..\u002Fdevelopment\u002Fcompilers\u002Frust\u002F1_42_0.nix {\n     inherit (darwin.apple_sdk.frameworks) CoreFoundation Security;\n   };\n-  rust = rust_1_41_0;\n+  rust = rust_1_42_0;\n \n-  rustPackages_1_41_0 = rust_1_41_0.packages.stable;\n-  rustPackages = rustPackages_1_41_0;\n+  rustPackages_1_42_0 = rust_1_42_0.packages.stable;\n+  rustPackages = rustPackages_1_42_0;\n \n   inherit (rustPackages) cargo clippy rustc rustPlatform;\n   inherit (rust) makeRustPlatform;\n@@ -21946,6 +21946,7 @@ in\n \n   thunderbird = callPackage ..\u002Fapplications\u002Fnetworking\u002Fmailreaders\u002Fthunderbird {\n     inherit (gnome2) libIDL;\n+    inherit (rustPackages_1_42_0) cargo rustc;\n     libpng = libpng_apng;\n     gtk3Support = true;\n   };\n\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\n",dir:"article\u002F.json\u002F2020",base:"2020-03-07-rustc-on-nixos.json",ext:".json",sourceBase:"2020-03-07-rustc-on-nixos.md",sourceExt:".md"}},title:{writable:true,enumerable:true,value:"rustc-1.41.1 on nixOS"},subtitle:{writable:true,enumerable:true,value:"especially for macOS"},date:{writable:true,enumerable:true,value:"2020-03-19T00:00:00.000Z"},tags:{writable:true,enumerable:true,value:["Rust","nixOS"]},bodyContent:{writable:true,enumerable:true,value:"sat-benchのバージョン上げる際にRust 1.41での新しい構文を使ったせいでrustc-1.41が必須になってしまった。\nそんなことは全然問題ないかと思ったらnixpkgsでの標準のRustPlatformの使用バージョンが1.37だったのでま\nずrustc-1.41を指定することが必要になった。ところがrustc-1.41がコンパイルできない。\nllvmのリンカがAMDGPUなんたらが見つからないというエラーが出る。時間を作って調べてみた。\n\n結論から言うと、\n\n1. [nixpkgs](https:\u002F\u002Fgithub.com\u002FNixOS\u002Fnixpkgs)をcloneして適当な新しめのブランチ（例えばnixpkgs-unstable）をcheckout。\n1. top directoryで `nix-build -A rustc-1.41` を実行すると問題なく生成できる\n1. なので\n   [pkgs\u002Fdevelopment\u002Fcompilers\u002Frust\u002F1_41_0.nix](https:\u002F\u002Fgithub.com\u002FNixOS\u002Fnixpkgs\u002Ftree\u002Fmaster\u002Fpkgs\u002Fdevelopment\u002Fcompilers\u002Frust\u002F)\n   で`rustcVersion`を\"1.41.1\"に変更（`rustcSha256`は変更してないのだが。。。）してbuildする\n1. 生成できたら同じディレクトリで`nix-build -A sat-bench`\n1. 生成できたら `nix-env -i path-to-the-derivation`を実行してインストール\n\nこれでOK。これまで`NIXPKGS`環境変数とかで指定したつもりだったのだが`nix-build`の利用が正解だったようだ。\n\n\n## 参考\n\n- [https:\u002F\u002Fnixos.wiki\u002Fwiki\u002FNixpkgs](https:\u002F\u002Fnixos.wiki\u002Fwiki\u002FNixpkgs)\n\n## 2020-03-19: スナップショット\n\nRust-1.42にバージョンアップ。\n\n```\ndiff --git a\u002Fpkgs\u002Fdevelopment\u002Fcompilers\u002Frust\u002F1_41_0.nix b\u002Fpkgs\u002Fdevelopment\u002Fcompilers\u002Frust\u002F1_41_0.nix\ndeleted file mode 100644\nindex b73d9b8ef26..00000000000\n--- a\u002Fpkgs\u002Fdevelopment\u002Fcompilers\u002Frust\u002F1_41_0.nix\n+++ \u002Fdev\u002Fnull\n@@ -1,48 +0,0 @@\n-# New rust versions should first go to staging.\n-# Things to check after updating:\n-# 1. Rustc should produce rust binaries on x86_64-linux, aarch64-linux and x86_64-darwin:\n-#    i.e. nix-shell -p fd or @GrahamcOfBorg build fd on github\n-#    This testing can be also done by other volunteers as part of the pull\n-#    request review, in case platforms cannot be covered.\n-# 2. The LLVM version used for building should match with rust upstream.\n-# 3. Firefox and Thunderbird should still build on x86_64-linux.\n-\n-{ stdenv, lib\n-, buildPackages\n-, newScope, callPackage\n-, CoreFoundation, Security\n-, llvmPackages_5\n-, pkgsBuildTarget, pkgsBuildBuild\n-, fetchpatch\n-} @ args:\n-\n-import .\u002Fdefault.nix {\n-  rustcVersion = \"1.41.0\";\n-  rustcSha256 = \"0jypz2mrzac41sj0zh07yd1z36g2s2rvgsb8g624sk4l14n84ijm\";\n-\n-  # Note: the version MUST be one version prior to the version we're\n-  # building\n-  bootstrapVersion = \"1.40.0\";\n-\n-  # fetch hashes by running `print-hashes.sh 1.40.0`\n-  bootstrapHashes = {\n-    i686-unknown-linux-gnu = \"d050d3a1c7c45ba9c50817d45bf6d7dd06e1a4d934f633c8096b7db6ae27adc1\";\n-    x86_64-unknown-linux-gnu = \"fc91f8b4bd18314e83a617f2389189fc7959146b7177b773370d62592d4b07d0\";\n-    arm-unknown-linux-gnueabihf = \"4be9949c4d3c572b69b1df61c3506a3a3ac044851f025d38599612e7caa933c5\";\n-    armv7-unknown-linux-gnueabihf = \"ebfe3978e12ffe34276272ee6d0703786249a9be80ca50617709cbfdab557306\";\n-    aarch64-unknown-linux-gnu = \"639271f59766d291ebdade6050e7d05d61cb5c822a3ef9a1e2ab185fed68d729\";\n-    i686-apple-darwin = \"ea189b1fb0bfda367cde6d43c18863ab4c64ffca04265e5746bf412a186fe1a2\";\n-    x86_64-apple-darwin = \"749ca5e0b94550369cc998416b8854c13157f5d11d35e9b3276064b6766bcb83\";\n-  };\n-\n-  selectRustPackage = pkgs: pkgs.rust_1_41_0;\n-\n-  rustcPatches = [\n-    (fetchpatch {\n-      url = \"https:\u002F\u002Fgithub.com\u002FQuiltOS\u002Frust\u002Fcommit\u002Ff1803452b9e95bfdbc3b8763138b9f92c7d12b46.diff\";\n-      sha256 = \"1mzxaj46bq7ll617wg0mqnbnwr1da3hd4pbap8bjwhs3kfqnr7kk\";\n-    })\n-  ];\n-}\n-\n-(builtins.removeAttrs args [ \"fetchpatch\" ])\ndiff --git a\u002Fpkgs\u002Fdevelopment\u002Fcompilers\u002Frust\u002F1_42_0.nix b\u002Fpkgs\u002Fdevelopment\u002Fcompilers\u002Frust\u002F1_42_0.nix\nnew file mode 100644\nindex 00000000000..fd2eaa79868\n--- \u002Fdev\u002Fnull\n+++ b\u002Fpkgs\u002Fdevelopment\u002Fcompilers\u002Frust\u002F1_42_0.nix\n@@ -0,0 +1,48 @@\n+# New rust versions should first go to staging.\n+# Things to check after updating:\n+# 1. Rustc should produce rust binaries on x86_64-linux, aarch64-linux and x86_64-darwin:\n+#    i.e. nix-shell -p fd or @GrahamcOfBorg build fd on github\n+#    This testing can be also done by other volunteers as part of the pull\n+#    request review, in case platforms cannot be covered.\n+# 2. The LLVM version used for building should match with rust upstream.\n+# 3. Firefox and Thunderbird should still build on x86_64-linux.\n+\n+{ stdenv, lib\n+, buildPackages\n+, newScope, callPackage\n+, CoreFoundation, Security\n+, llvmPackages_5\n+, pkgsBuildTarget, pkgsBuildBuild\n+, fetchpatch\n+} @ args:\n+\n+import .\u002Fdefault.nix {\n+  rustcVersion = \"1.42.0\";\n+  rustcSha256 = \"0x9lxs82may6c0iln0b908cxyn1cv7h03n5cmbx3j1bas4qzks6j\";\n+\n+  # Note: the version MUST be one version prior to the version we're\n+  # building\n+  bootstrapVersion = \"1.41.1\";\n+\n+  # fetch hashes by running `print-hashes.sh 1.41.1`\n+  bootstrapHashes = {\n+    i686-unknown-linux-gnu = \"085c8880ee635c2182504a1f2aaa2865455f9ff43511b3976a2140a8bfcce6f3\";\n+    x86_64-unknown-linux-gnu = \"a6d5a3b3f574aafc8f787fea37aad9fb8a7946b383ae5348146927192ff0bef0\";\n+    arm-unknown-linux-gnueabihf = \"210090e13970646707325fc0270ef368cde3e2a4a7671f2cf374f57fcc8e3770\";\n+    armv7-unknown-linux-gnueabihf = \"531e4006fee503ba1581c3feca2932f99d0df97bc2361e33fa028e3d7060ccc1\";\n+    aarch64-unknown-linux-gnu = \"d54c0f9165b86216b6f1b499f451141407939c5dc6b36c89a3772895a1370242\";\n+    i686-apple-darwin = \"727cbbfa58a2698d577c99f2a221512bff6ba07ca98ec47cf7ec5043eca60c81\";\n+    x86_64-apple-darwin = \"16615288cf74239783de1b435d329f3d56ed13803c7c10cd4b207d7c8ffa8f67\";\n+  };\n+\n+  selectRustPackage = pkgs: pkgs.rust_1_42_0;\n+\n+#  rustcPatches = [\n+#    (fetchpatch {\n+#      url = \"https:\u002F\u002Fgithub.com\u002FQuiltOS\u002Frust\u002Fcommit\u002Ff1803452b9e95bfdbc3b8763138b9f92c7d12b46.diff\";\n+#      sha256 = \"1mzxaj46bq7ll617wg0mqnbnwr1da3hd4pbap8bjwhs3kfqnr7kk\";\n+#    })\n+#  ];\n+}\n+\n+(builtins.removeAttrs args [ \"fetchpatch\" ])\ndiff --git a\u002Fpkgs\u002Ftop-level\u002Fall-packages.nix b\u002Fpkgs\u002Ftop-level\u002Fall-packages.nix\nindex 60da1eeaf5b..2d435f022e4 100644\n--- a\u002Fpkgs\u002Ftop-level\u002Fall-packages.nix\n+++ b\u002Fpkgs\u002Ftop-level\u002Fall-packages.nix\n@@ -8846,13 +8846,13 @@ in\n     inherit (darwin) apple_sdk;\n   };\n \n-  rust_1_41_0 = callPackage ..\u002Fdevelopment\u002Fcompilers\u002Frust\u002F1_41_0.nix {\n+  rust_1_42_0 = callPackage ..\u002Fdevelopment\u002Fcompilers\u002Frust\u002F1_42_0.nix {\n     inherit (darwin.apple_sdk.frameworks) CoreFoundation Security;\n   };\n-  rust = rust_1_41_0;\n+  rust = rust_1_42_0;\n \n-  rustPackages_1_41_0 = rust_1_41_0.packages.stable;\n-  rustPackages = rustPackages_1_41_0;\n+  rustPackages_1_42_0 = rust_1_42_0.packages.stable;\n+  rustPackages = rustPackages_1_42_0;\n \n   inherit (rustPackages) cargo clippy rustc rustPlatform;\n   inherit (rust) makeRustPlatform;\n@@ -21946,6 +21946,7 @@ in\n \n   thunderbird = callPackage ..\u002Fapplications\u002Fnetworking\u002Fmailreaders\u002Fthunderbird {\n     inherit (gnome2) libIDL;\n+    inherit (rustPackages_1_42_0) cargo rustc;\n     libpng = libpng_apng;\n     gtk3Support = true;\n   };\n```"},bodyHtml:{writable:true,enumerable:true,value:"\u003Cp\u003Esat-benchのバージョン上げる際にRust 1.41での新しい構文を使ったせいでrustc-1.41が必須になってしまった。\nそんなことは全然問題ないかと思ったらnixpkgsでの標準のRustPlatformの使用バージョンが1.37だったのでま\nずrustc-1.41を指定することが必要になった。ところがrustc-1.41がコンパイルできない。\nllvmのリンカがAMDGPUなんたらが見つからないというエラーが出る。時間を作って調べてみた。\u003C\u002Fp\u003E\n\u003Cp\u003E結論から言うと、\u003C\u002Fp\u003E\n\u003Col\u003E\n\u003Cli\u003E\u003Ca href=\"https:\u002F\u002Fgithub.com\u002FNixOS\u002Fnixpkgs\"\u003Enixpkgs\u003C\u002Fa\u003Eをcloneして適当な新しめのブランチ（例えばnixpkgs-unstable）をcheckout。\u003C\u002Fli\u003E\n\u003Cli\u003Etop directoryで \u003Ccode\u003Enix-build -A rustc-1.41\u003C\u002Fcode\u003E を実行すると問題なく生成できる\u003C\u002Fli\u003E\n\u003Cli\u003Eなので\n\u003Ca href=\"https:\u002F\u002Fgithub.com\u002FNixOS\u002Fnixpkgs\u002Ftree\u002Fmaster\u002Fpkgs\u002Fdevelopment\u002Fcompilers\u002Frust\u002F\"\u003Epkgs\u002Fdevelopment\u002Fcompilers\u002Frust\u002F1_41_0.nix\u003C\u002Fa\u003E\nで\u003Ccode\u003ErustcVersion\u003C\u002Fcode\u003Eを&quot;1.41.1&quot;に変更（\u003Ccode\u003ErustcSha256\u003C\u002Fcode\u003Eは変更してないのだが。。。）してbuildする\u003C\u002Fli\u003E\n\u003Cli\u003E生成できたら同じディレクトリで\u003Ccode\u003Enix-build -A sat-bench\u003C\u002Fcode\u003E\u003C\u002Fli\u003E\n\u003Cli\u003E生成できたら \u003Ccode\u003Enix-env -i path-to-the-derivation\u003C\u002Fcode\u003Eを実行してインストール\u003C\u002Fli\u003E\n\u003C\u002Fol\u003E\n\u003Cp\u003EこれでOK。これまで\u003Ccode\u003ENIXPKGS\u003C\u002Fcode\u003E環境変数とかで指定したつもりだったのだが\u003Ccode\u003Enix-build\u003C\u002Fcode\u003Eの利用が正解だったようだ。\u003C\u002Fp\u003E\n\u003Ch2\u003E参考\u003C\u002Fh2\u003E\n\u003Cul\u003E\n\u003Cli\u003E\u003Ca href=\"https:\u002F\u002Fnixos.wiki\u002Fwiki\u002FNixpkgs\"\u003Ehttps:\u002F\u002Fnixos.wiki\u002Fwiki\u002FNixpkgs\u003C\u002Fa\u003E\u003C\u002Fli\u003E\n\u003C\u002Ful\u003E\n\u003Ch2\u003E2020-03-19: スナップショット\u003C\u002Fh2\u003E\n\u003Cp\u003ERust-1.42にバージョンアップ。\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode\u003Ediff --git a\u002Fpkgs\u002Fdevelopment\u002Fcompilers\u002Frust\u002F1_41_0.nix b\u002Fpkgs\u002Fdevelopment\u002Fcompilers\u002Frust\u002F1_41_0.nix\ndeleted file mode 100644\nindex b73d9b8ef26..00000000000\n--- a\u002Fpkgs\u002Fdevelopment\u002Fcompilers\u002Frust\u002F1_41_0.nix\n+++ \u002Fdev\u002Fnull\n@@ -1,48 +0,0 @@\n-# New rust versions should first go to staging.\n-# Things to check after updating:\n-# 1. Rustc should produce rust binaries on x86_64-linux, aarch64-linux and x86_64-darwin:\n-#    i.e. nix-shell -p fd or @GrahamcOfBorg build fd on github\n-#    This testing can be also done by other volunteers as part of the pull\n-#    request review, in case platforms cannot be covered.\n-# 2. The LLVM version used for building should match with rust upstream.\n-# 3. Firefox and Thunderbird should still build on x86_64-linux.\n-\n-{ stdenv, lib\n-, buildPackages\n-, newScope, callPackage\n-, CoreFoundation, Security\n-, llvmPackages_5\n-, pkgsBuildTarget, pkgsBuildBuild\n-, fetchpatch\n-} @ args:\n-\n-import .\u002Fdefault.nix {\n-  rustcVersion = &quot;1.41.0&quot;;\n-  rustcSha256 = &quot;0jypz2mrzac41sj0zh07yd1z36g2s2rvgsb8g624sk4l14n84ijm&quot;;\n-\n-  # Note: the version MUST be one version prior to the version we're\n-  # building\n-  bootstrapVersion = &quot;1.40.0&quot;;\n-\n-  # fetch hashes by running `print-hashes.sh 1.40.0`\n-  bootstrapHashes = {\n-    i686-unknown-linux-gnu = &quot;d050d3a1c7c45ba9c50817d45bf6d7dd06e1a4d934f633c8096b7db6ae27adc1&quot;;\n-    x86_64-unknown-linux-gnu = &quot;fc91f8b4bd18314e83a617f2389189fc7959146b7177b773370d62592d4b07d0&quot;;\n-    arm-unknown-linux-gnueabihf = &quot;4be9949c4d3c572b69b1df61c3506a3a3ac044851f025d38599612e7caa933c5&quot;;\n-    armv7-unknown-linux-gnueabihf = &quot;ebfe3978e12ffe34276272ee6d0703786249a9be80ca50617709cbfdab557306&quot;;\n-    aarch64-unknown-linux-gnu = &quot;639271f59766d291ebdade6050e7d05d61cb5c822a3ef9a1e2ab185fed68d729&quot;;\n-    i686-apple-darwin = &quot;ea189b1fb0bfda367cde6d43c18863ab4c64ffca04265e5746bf412a186fe1a2&quot;;\n-    x86_64-apple-darwin = &quot;749ca5e0b94550369cc998416b8854c13157f5d11d35e9b3276064b6766bcb83&quot;;\n-  };\n-\n-  selectRustPackage = pkgs: pkgs.rust_1_41_0;\n-\n-  rustcPatches = [\n-    (fetchpatch {\n-      url = &quot;https:\u002F\u002Fgithub.com\u002FQuiltOS\u002Frust\u002Fcommit\u002Ff1803452b9e95bfdbc3b8763138b9f92c7d12b46.diff&quot;;\n-      sha256 = &quot;1mzxaj46bq7ll617wg0mqnbnwr1da3hd4pbap8bjwhs3kfqnr7kk&quot;;\n-    })\n-  ];\n-}\n-\n-(builtins.removeAttrs args [ &quot;fetchpatch&quot; ])\ndiff --git a\u002Fpkgs\u002Fdevelopment\u002Fcompilers\u002Frust\u002F1_42_0.nix b\u002Fpkgs\u002Fdevelopment\u002Fcompilers\u002Frust\u002F1_42_0.nix\nnew file mode 100644\nindex 00000000000..fd2eaa79868\n--- \u002Fdev\u002Fnull\n+++ b\u002Fpkgs\u002Fdevelopment\u002Fcompilers\u002Frust\u002F1_42_0.nix\n@@ -0,0 +1,48 @@\n+# New rust versions should first go to staging.\n+# Things to check after updating:\n+# 1. Rustc should produce rust binaries on x86_64-linux, aarch64-linux and x86_64-darwin:\n+#    i.e. nix-shell -p fd or @GrahamcOfBorg build fd on github\n+#    This testing can be also done by other volunteers as part of the pull\n+#    request review, in case platforms cannot be covered.\n+# 2. The LLVM version used for building should match with rust upstream.\n+# 3. Firefox and Thunderbird should still build on x86_64-linux.\n+\n+{ stdenv, lib\n+, buildPackages\n+, newScope, callPackage\n+, CoreFoundation, Security\n+, llvmPackages_5\n+, pkgsBuildTarget, pkgsBuildBuild\n+, fetchpatch\n+} @ args:\n+\n+import .\u002Fdefault.nix {\n+  rustcVersion = &quot;1.42.0&quot;;\n+  rustcSha256 = &quot;0x9lxs82may6c0iln0b908cxyn1cv7h03n5cmbx3j1bas4qzks6j&quot;;\n+\n+  # Note: the version MUST be one version prior to the version we're\n+  # building\n+  bootstrapVersion = &quot;1.41.1&quot;;\n+\n+  # fetch hashes by running `print-hashes.sh 1.41.1`\n+  bootstrapHashes = {\n+    i686-unknown-linux-gnu = &quot;085c8880ee635c2182504a1f2aaa2865455f9ff43511b3976a2140a8bfcce6f3&quot;;\n+    x86_64-unknown-linux-gnu = &quot;a6d5a3b3f574aafc8f787fea37aad9fb8a7946b383ae5348146927192ff0bef0&quot;;\n+    arm-unknown-linux-gnueabihf = &quot;210090e13970646707325fc0270ef368cde3e2a4a7671f2cf374f57fcc8e3770&quot;;\n+    armv7-unknown-linux-gnueabihf = &quot;531e4006fee503ba1581c3feca2932f99d0df97bc2361e33fa028e3d7060ccc1&quot;;\n+    aarch64-unknown-linux-gnu = &quot;d54c0f9165b86216b6f1b499f451141407939c5dc6b36c89a3772895a1370242&quot;;\n+    i686-apple-darwin = &quot;727cbbfa58a2698d577c99f2a221512bff6ba07ca98ec47cf7ec5043eca60c81&quot;;\n+    x86_64-apple-darwin = &quot;16615288cf74239783de1b435d329f3d56ed13803c7c10cd4b207d7c8ffa8f67&quot;;\n+  };\n+\n+  selectRustPackage = pkgs: pkgs.rust_1_42_0;\n+\n+#  rustcPatches = [\n+#    (fetchpatch {\n+#      url = &quot;https:\u002F\u002Fgithub.com\u002FQuiltOS\u002Frust\u002Fcommit\u002Ff1803452b9e95bfdbc3b8763138b9f92c7d12b46.diff&quot;;\n+#      sha256 = &quot;1mzxaj46bq7ll617wg0mqnbnwr1da3hd4pbap8bjwhs3kfqnr7kk&quot;;\n+#    })\n+#  ];\n+}\n+\n+(builtins.removeAttrs args [ &quot;fetchpatch&quot; ])\ndiff --git a\u002Fpkgs\u002Ftop-level\u002Fall-packages.nix b\u002Fpkgs\u002Ftop-level\u002Fall-packages.nix\nindex 60da1eeaf5b..2d435f022e4 100644\n--- a\u002Fpkgs\u002Ftop-level\u002Fall-packages.nix\n+++ b\u002Fpkgs\u002Ftop-level\u002Fall-packages.nix\n@@ -8846,13 +8846,13 @@ in\n     inherit (darwin) apple_sdk;\n   };\n \n-  rust_1_41_0 = callPackage ..\u002Fdevelopment\u002Fcompilers\u002Frust\u002F1_41_0.nix {\n+  rust_1_42_0 = callPackage ..\u002Fdevelopment\u002Fcompilers\u002Frust\u002F1_42_0.nix {\n     inherit (darwin.apple_sdk.frameworks) CoreFoundation Security;\n   };\n-  rust = rust_1_41_0;\n+  rust = rust_1_42_0;\n \n-  rustPackages_1_41_0 = rust_1_41_0.packages.stable;\n-  rustPackages = rustPackages_1_41_0;\n+  rustPackages_1_42_0 = rust_1_42_0.packages.stable;\n+  rustPackages = rustPackages_1_42_0;\n \n   inherit (rustPackages) cargo clippy rustc rustPlatform;\n   inherit (rust) makeRustPlatform;\n@@ -21946,6 +21946,7 @@ in\n \n   thunderbird = callPackage ..\u002Fapplications\u002Fnetworking\u002Fmailreaders\u002Fthunderbird {\n     inherit (gnome2) libIDL;\n+    inherit (rustPackages_1_42_0) cargo rustc;\n     libpng = libpng_apng;\n     gtk3Support = true;\n   };\n\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\n"},dir:{writable:true,enumerable:true,value:"article\u002F.json\u002F2020"},base:{writable:true,enumerable:true,value:"2020-03-07-rustc-on-nixos.json"},ext:{writable:true,enumerable:true,value:".json"},sourceBase:{writable:true,enumerable:true,value:"2020-03-07-rustc-on-nixos.md"},sourceExt:{writable:true,enumerable:true,value:".md"}})}],fetch:[],mutations:[]});