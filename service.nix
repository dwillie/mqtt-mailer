{mkService, callPackage, nodejs, mqtt-mailer ? callPackage ./release.nix {}, mosquitto}:

let
  executionPath = ''${mqtt-mailer.build}/lib/node_modules/mqtt-mailer'';
in mkService rec {
  name = "mqtt-mailer";
  user.name = "mqtt-mailer";
  user.home = "/var/lib/${user.name}";

  dependsOn = [ mosquitto ];
  environment = {
    MAILER_ADDRESS = "YOUR_USERNAME@gmail.com";
    MAILER_PWD = "YOUR_PASSWORD";
    CONFIG_FILE_PATH = "${user.home}/config.json";
  };
  script = ''
    cd ${executionPath}
    exec ${nodejs}/bin/node --use_strict ${executionPath}/dist/app.js
  '';
}
