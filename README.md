# Quill Linkify

Quill plugin that converts **URL, mail address, phone number** to link.

## Install

```
yarn add quill-linkify
```

## How to use

```ts
import Quill from 'quill';
import { Linkify } from 'quill-linkify';

Quill.register('modules/linkify', Linkify);

const quill = new Quill("Element", {
  modules: {
    linkify: true,
  },
});
```

## Regular Expression
| Type | RegExp |
| --- | --- |
| URL | `/(https?:\/\/\|www\.)[\w-\.]+\.[\w-\.]+(\/([\S]+)?)?/i` |
| Mail | `/([\w-\.]+@[\w-\.]+\.[\w-\.]+)/i` |
| Phone number | `/(((0(\d{1}[-(]?\d{4}\|\d{2}[-(]?\d{3}\|\d{3}[-(]?\d{2}\|\d{4}[-(]?\d{1}\|[5789]0[-(]?\d{4})[-)]?)\|\d{1,4}-?)\d{4}\|0120[-(]?\d{3}[-)]?\d{3})/i` |