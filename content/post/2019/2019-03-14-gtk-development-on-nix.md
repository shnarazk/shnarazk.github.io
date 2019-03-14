---
title: GTK development on Nix
date: 2019-03-14
tags: ["gtk", "NixOS", "macOS"]
---

## C

```
nix-shell -p gtk3 gcc pkgconfig
```

```console
# https://developer.gnome.org/gtk3/stable/gtk-getting-started.html
gcc `pkg-config --cflags gtk+-3.0` -o example example.c `pkg-config --libs gtk+-3.0`
```

That works.

## Rust

- gtk = 0.5  # 0.6 requires unstable channel

```
$ nix-shell -p gtk3 gcc pkgconfig rustc cargo llvm
$ cargo run
    Finished dev [unoptimized + debuginfo] target(s) in 0.21s                                       
     Running `target/debug/gtktest`
thread 'main' panicked at 'libgtk-3 was configured with `--enable-debug=no`. See https://github.com/gtk-rs/gtk/issues/270 for details', /Users/nash/.cargo/registry/src/github.com-1ecc6299db9ec823/gtk-0.5.0/src/rt.rs:137:13
note: Run with `RUST_BACKTRACE=1` for a backtrace.
```

- https://github.com/NixOS/nixpkgs/blob/master/pkgs/development/libraries/gtk%2B/3.x.nix


So let's make an overlay:

```
self: super:
{
    gtk3RustDarwin = super.gtk3.overrideDerivation (attrs: { 
        configureFlags = [
            "--enable-debug"
            "--disable-dependency-tracking"
            "--disable-glibtest"
            "--enable-quartz-backend"
        ];
    });
}
```

It needs `overrideDerivation`. What's this???
