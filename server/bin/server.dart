import 'dart:io';

import 'package:args/args.dart';
import 'package:shelf/shelf.dart' as shelf;
import 'package:shelf/shelf_io.dart' as io;

// HostName & IP Configuration

const _hostname = 'localhost';

// Starting The Server

void main(List<String> args) async {
  stdout.writeln("Welcome To Ashkans Dart Server");
  stdout.writeln("EXM: AshDart Start Server -H localhost -P 4444");
  stdout.writeln("General Commands ===>>> ");
  stdout.writeln("Start Server");
  stdout.writeln("Kill Server");
  stdout.writeln("Option Commands ===>>>");
  stdout.writeln("-P    Port");
  stdout.writeln("-H    Host");

  // Initializing ...

  var init = ArgParser()..addOption('port', abbr: 'p');
  var parser = init.parse(args);

  // User Input and Information

  String userip = stdin.readLineSync();
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
