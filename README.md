# Next.js + Tailwind CSS + Ionic Framework + Capacitor Mobile Starter

## Requirements
npm 10.2.5

node 20.5.0

JDK 17

## Usage

To build the app, run:

```bash
npm run build
npm run export
```

All the client side files will be sent to the `./out/` directory. These files need to be copied to the native iOS and Android projects, and this is where Capacitor comes in:

```bash
npx cap sync
```

Finally, to run the app, use Capacitor run command:

```
npx cap run android
```

There's also an apk file in /android/app-debug.apk for your convenience.
