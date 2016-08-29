{ pkgs ? import <nixpkgs> {}
, mqtt-mailer ? ./. }:

let
  pkg = pkgs.callPackage mqtt-mailer {};
  buildTools = pkgs.callPackage ./build_scripts/build.nix { doNotBrowsify = ["request"]; };
in rec {
  inherit (pkg) tarball;
  build = buildTools.detoxNodePackage pkg;

  # Will be run in a container with all Detox services running
  integrationTest = ''
    echo NOTE: No integration tests for mqtt-mailer.
  '';
}
