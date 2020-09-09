# express-react-view

React SSR with Express

## Installation

With NPM

```bash
npm install express-react-view
```

Or with Yarn

```bash
yarn add express-react-view
```

## Usage

### Server file

```javascript
const express = require('express')
const render = require('express-react-view')
/* Or
import express from 'express'
import { render } from 'express-react-view'
*/

const options = {
  root: path.join(__dirname, 'views'),
  ext: 'jsx',
  cache: false,
  layout: 'Layout',
}

const app = express()
// Register view engine
app.set('views', __dirname + '/views')
app.set('view engine', 'jsx')
app.engine('jsx', render(options))

// Use res.render to render a view with variables
app.use((req, res) => {
  res.render('home', { name: 'World' })
})

app.listen(3000)
```

### View file

```jsx
import React from 'react'

// Views (as well as layout) should always be default exported
export default function Home({ name }) {
  return <div>Hello {name}!</div>
}
```

## Options

| name   | type    | mandatory | default value | description                                                                                     |
| ------ | ------- | --------- | ------------- | ----------------------------------------------------------------------------------------------- |
| root   | string  | yes       |               | root folder of the views                                                                        |
| ext    | string  | no        | jsx           | extension of the view (with or without a `.`)                                                   |
| cache  | boolean | no        | true          | should the views be cached or not (recommended: `true` for production, `false` for development) |
| layout | string  | no        |               | filename of the layout component views                                                          |

## Using a layout

You can use a layout to wrap your views. All variables available in the view are available in the layout.

```jsx
import React from 'react'

export default function Layout({ children }) {
  return (
    <html>
      <head></head>
      {/* Bellow is your view */}
      <body>{children}</body>
    </html>
  )
}
```
