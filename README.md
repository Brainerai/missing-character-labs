# Missing Character Lab

A fan-made Pattern Retrieval experiment that turns X/Twitter handles into missing ASCII-style specimens.

94 printable specimens were archived. This machine searches for the unstable visitor outside the set.

## What it does

Missing Character Lab lets anyone enter an X handle and generate a unique missing-character specimen.

The site simulates a small retrieval process:

```txt
store → corrupt → relax → recall
```

Each handle generates:

* a unique block-grid specimen
* a missing character identity
* a specimen number
* a fun recall/result report
* a downloadable result card
* a separate downloadable grid block

The downloaded grid block also contains a hidden payload, so it can be uploaded back into the site and read to recover the original X handle.

## Features

* Handle-based deterministic specimen generation
* CRT-inspired interface
* Corruption and recall animation
* Downloadable result card
* Downloadable standalone grid block
* Upload/read grid block to recover the generated subject
* X/Twitter share button

## Tech Stack

* Next.js
* React
* TypeScript
* CSS

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

## Build

```bash
npm run build
```

## Notes

This is a fan-made project created for fun and community engagement.

It is not affiliated with Pattern Retrieval, Adam Lienich, or any official release.
