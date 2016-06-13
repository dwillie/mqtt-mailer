{ mqtt-mailer ? { outPath = ./.; name = "mqtt-mailer"; }
, pkgs ? import <nixpkgs> {}
}:
let
  nodePackages = import "${pkgs.path}/pkgs/top-level/node-packages.nix" {
    inherit pkgs;
    inherit (pkgs) stdenv nodejs fetchurl fetchgit;
    neededNatives = [ pkgs.python ] ++ pkgs.lib.optional pkgs.stdenv.isLinux pkgs.utillinux;
    self = nodePackages;
    generated = ./package.nix;
  };
in rec {
  tarball = pkgs.runCommand "mqtt-mailer-0.0.1.tgz" { buildInputs = [ pkgs.nodejs ]; } ''
    mv `HOME=$PWD npm pack ${mqtt-mailer}` $out
  '';
  build = nodePackages.buildNodePackage {
    name = "mqtt-mailer-0.0.1";
    src = [ tarball ];
    buildInputs = nodePackages.nativeDeps."mqtt-mailer" or [];
    deps = [ nodePackages.by-spec."mqtt"."1.8.0" nodePackages.by-spec."winston"."2.2.0" nodePackages.by-spec."config.json"."0.0.4" nodePackages.by-spec."validator"."5.2.0" nodePackages.by-spec."nodemailer"."2.3.2" nodePackages.by-spec."nodemailer-smtp-transport"."2.4.2" nodePackages.by-spec."prompt"."1.0.0" ];
    peerDependencies = [];
  };
}