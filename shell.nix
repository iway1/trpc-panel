with import <nixpkgs> {};
  mkShell {
    name = "trpc-panel";
    buildInputs = with nodePackages; [nodejs yarn];
  }
