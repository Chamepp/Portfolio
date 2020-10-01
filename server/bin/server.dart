import 'dart:io';

import 'package:args/args.dart';
import 'package:shelf/shelf.dart' as shelf;
import 'package:shelf/shelf_io.dart' as io;

// HostName & IP Configuration

const _hostname = 'localhost';

// Starting The Server

void main(List<String> args) async {
  // Initializing ...

  var init = ArgParser()..addOption('port', abbr: 'p');
  var parser = init.parse(args);

  // Port Configurations

  var portvalue = parser['port'] ?? Platform.environment['PORT'] ?? '8080';
  var port = int.tryParse(portvalue);

  // Port Configuration Fail

  if (port == null) {
    stdout.writeln('Could not parse port value "$portvalue" into a number.');

    // ExitCode 64 For Command Line Usage Err

    exitCode = 64;
    return;
  }

  // Handeling Log Requests

  var handler = const shelf.Pipeline()
      .addMiddleware(shelf.logRequests())
      .addHandler(_echoRequest);

  // Setting Configured Credentials To The Server ...

  var server = await io.serve(handler, _hostname, port);
  print('Serving at http://${server.address.host}:${server.port}');
}

// Request Logger

shelf.Response _echoRequest(shelf.Request request) =>
    shelf.Response.ok('Request for "${request.url}"');
