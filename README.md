# HotLogger

The fast, web-based ham radio logging program supporting real-time,
multi-user logging and multiple contest formats.

## Developing

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

## License

HotLogger is [free software][2] released under the terms of the Copyfree Open
Innovation License, version 1.0. See [COPYING](COPYING) for details.

[1]: https://pocketbase.io/
[2]: https://gnu.org/philosophy/free-sw.html