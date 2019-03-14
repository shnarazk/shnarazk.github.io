---
title: GTK development on Nix on macOS
subtitle: これでどこでもgtkでいいじゃん
date: 2019-03-14
tags: ["gtk", "NixOS", "macOS"]
---

## C

- target: https://developer.gnome.org/gtk3/stable/gtk-getting-started.html

Dive into the environment:

```shell
nix-shell -p gtk3 gcc pkgconfig
```

And compile:
```shell
gcc `pkg-config --cflags gtk+-3.0` -o example example.c `pkg-config --libs gtk+-3.0`
```

That works.

## Rust

- package: https://crates.io/crates/gtk
- target: https://github.com/gtk-rs/gtk/blob/master/src/rt.rs
- Cargo.toml: `gtk = 0.5`  # 0.6 requires unstable channel

Start with the same approach:

```shell
$ nix-shell -p gtk3 pkgconfig rustc cargo llvm
$ cargo run
    Finished dev [unoptimized + debuginfo] target(s) in 0.21s                                       
     Running `target/debug/gtktest`
thread 'main' panicked at 'libgtk-3 was configured with `--enable-debug=no`. See https://github.com/gtk-rs/gtk/issues/270 for details', ~/.cargo/registry/src/github.com-1ecc6299db9ec823/gtk-0.5.0/src/rt.rs:137:13
note: Run with `RUST_BACKTRACE=1` for a backtrace.
```

- the issue: https://github.com/gtk-rs/gtk/issues/270
- src:  [nix expression for gtk3](https://github.com/NixOS/nixpkgs/blob/master/pkgs/development/libraries/gtk%2B/3.x.nix)


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

Anyway, give it a try.

```shell
$ nix-shell -p gtk3RustDarwin pkgconfig rustc cargo llvm
$ cargo clean  # to purge the previous attempt
$ cargo run
```

That works!
