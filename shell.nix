let
  pkgs = import <nixpkgs> {};
in
  pkgs.mkShell {
    # packages = with pkgs; [
    # ];
    buildInputs = with pkgs; [
      pkg-config
      # openssl
      openssl.dev
      # rustc
      # cargo
      # rustPackages.clippy
      # gcc
      # libiconv
    ];
    env = {
      NIX_ENFORCE_PURITY = 0;
    };

    nativeBuildInputs = with pkgs; [
      zsh
    ];
    shellHook = ''
      exec zsh
    '';
  }
