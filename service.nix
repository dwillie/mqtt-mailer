{mkService, callPackage, nodejs, mqtt-mailer ? callPackage ./default.nix {}, mosquitto}:

mkService {
  name = "mqtt-mailer";
  dependsOn = [ mosquitto ];
  environment = {
    MAILER_ADDRESS = "YOUR_USERNAME@gmail.com";
    MAILER_PWD = "YOUR_PASSWORD";
  };
  script = "exec ${nodejs}/bin/node --use_strict ${mqtt-mailer.build}/lib/node_modules/mqtt-mailer/src/app.js";
}
