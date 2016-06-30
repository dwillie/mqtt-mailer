{ pkgs ? import <nixpkgs> {}
, mqtt-mailer ? ./. }:

let
  pkg = pkgs.callPackage mqtt-mailer {};
in rec {
  inherit (pkg) tarball build;

  # Will be run in a container with all Detox services running
  integrationTest = ''
    echo NOTE: No integration tests for mqtt-mailer.
  '';
}
