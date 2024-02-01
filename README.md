# HotLogger

The fast, web-based ham radio logging program supporting real-time,
multi-user logging and multiple contest formats.

## How to Install

This guide assumes you already have a server running GNU/Linux or some other
UNIX-like operating system from which you intend to host HotLogger.

You'll need [PocketBase][1] and [Node.js][4] in order to run HotLogger.

Download the latest release tarball or make one using the "building"
instructions below. The file will have a name resembling
`hotlogger-a.b.c.tar.gz` where `a.b.c` is the version number.

Extract the archive and go into the resulting directory:

    tar xf hotlogger-a.b.c.tar.gz
    cd hotlogger-a.b.c/

*From that directory,* start the database:

    pocketbase serve

Now, you're ready to start HotLogger. You have a couple of options. If you just
want to run HotLogger and be reachable from the LAN, you need to specify the
hostname in the `HOTLOGGER_ORIGIN` environment variable, e.g.:

    HOTLOGGER_ORIGIN=http://myhost.local:3000 node hotlogger

If you want to run it behind a reverse proxy such as nginx, you need to specify
some different variables:

    PROTOCOL_HEADER=x-forwarded-proto HOST_HEADER=x-forwarded-host node hotlogger

By default, HotLogger will bind to port 3000. To change this, set the
`HOTLOGGER_PORT` environment variable to the desired port.

Once you've started HotLogger using `node`, you're ready to connect. Open your
browser and navigate to the host you specified in `HOTLOGGER_ORIGIN` or to your
reverse proxy server.

## Developing

**NOTE:** All below commands are to be run from the root of this repository.

This app optionally utilizes [NVM][3].

```bash
#if using nvm, and not running automatically
nvm use
```

This app requires [PocketBase][1].

```bash
# install dependencies
npm install

# start database
pocketbase serve

# run local dev server
npm run dev
```

## Building

To build a production version:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

To assemble a tarball that can be deployed offline:

```bash
npm run package
```

## License

HotLogger is [free software][2] released under the terms of the Copyfree Open
Innovation License, version 1.0. See [COPYING](COPYING) for details.

[1]: https://pocketbase.io/docs/
[2]: https://gnu.org/philosophy/free-sw.html
[3]: https://github.com/nvm-sh/nvm/tree/master
[4]: https://nodejs.org/