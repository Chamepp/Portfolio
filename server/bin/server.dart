import 'dart:io';

import 'package:args/args.dart';
import 'package:shelf/shelf.dart' as shelf;
import 'package:shelf/shelf_io.dart' as io;

const _hostname = 'localhost';

// Starting The Server

void main(List<String> args) async {
  stdout.writeln("Welcome To Ashkans Dart Server \n \n \n");
  stdout.writeln("EXM: AshDart Start Server -H localhost -P 4444 \n \n");
  stdout.writeln("General Commands ===>>> \n \n");
  stdout.writeln("Start Server \n");
  stdout.writeln("Kill Server \n \n \n");
  stdout.writeln("Option Commands ===>>> \n \n");
  stdout.writeln("-P    Port \n");
  stdout.writeln("-H    Host \n");

  // Initializing ...

  var init = ArgParser()..addOption('port', abbr: 'p');
  var parser = init.parse(args);

  // User Input and Information

  stdout.writeln("Enter Your Purpose Ip Adress : ");
  String userip = stdin.readLineSync();
  stdout.writeln("Enter Your Purposal Port : ");
  String userport = stdin.readLineSync();

  // Port Configurations

  var portvalue = parser['port'] ?? Platform.environment['PORT'] ?? '$userport';
  var port = int.tryParse(portvalue);

  // Port Configuration Fail

  if (port == null) {
    stdout.writeln('Could not parse port value "$portvalue" into a number.');

    // ExitCode 64 For Command Line Usage Err

    exitCode = 64;
    return;
  }

  // Handeling Log Requests

  var protocol = const shelf.Pipeline()
      .addMiddleware(shelf.logRequests())
      .addHandler(_echoRequest);

  // Setting Configured Credentials To The Server ...

  var server = await io.serve(protocol, _hostname, port);
  print('Started Server at http://${server.address.host}:${server.port}');
}

// Request Logger

shelf.Response _echoRequest(shelf.Request request) =>
    shelf.Response.ok('Request for "${request.url}"');
