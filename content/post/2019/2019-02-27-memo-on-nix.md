---
title: Memo on Nixpkgs
subtitle: nixで最強パッケージ管理
date: 2019-02-27
tags: ["nixos"]
---

## Location of my configuration file

is **~/.config/nixpkgs/config.nix**.

- https://nixos.wiki/wiki/FAQ#How_can_I_manage_software_with_nix-env_like_with_configuration.nix.3F


## Overriding nix package

- 'error: attribute `override' missing'

Probably you're trying to override a non-existing package.

For example, the following emits the error because `emacs26` doesn't exist.

```
# ~/.config/nixpkgs/config.nix
{ pkgs }:
{
    allowBroken = true;
    allowUnfree = true;

    packageOverrides = pkgs : rec {
   	emacs26 = pkgs.stdenv.lib.overrideDerivation pkgs.emacs26 (oldAttrs : {
	    name = "emacs-26.1.92";
	    version = "26.1.92";
	    src = pkgs.fetchurl {
	        url = "https://alpha.gnu.org/gnu/emacs/pretest/emacs-26.1.92.tar.xz";
		    sha256 = "0aa1dfa39b020feb49b82a388863c8a4b2ee0f1dfc04528f49759dbba4f28d41";
		};
	});
  };
}
```

By changing the package name to `emacs`, it works.

- https://github.com/NixOS/nixpkgs/issues/4017

### UPDATE

`overrideDerivation` is almost depricated. Here's a better version:

```
self: super:
{
    emacs26 = super.emacs26.overrideAttrs (attrs: rec {
        name = "emacs-26.1.92";
        version = "26.1.92";
        src = super.fetchurl {
            url = "https://alpha.gnu.org/gnu/emacs/pretest/emacs-26.1.92.tar.xz";
            sha256 = "0aa1dfa39b020feb49b82a388863c8a4b2ee0f1dfc04528f49759dbba4f28d41";
        };
        patches = [];
    });
}
```

