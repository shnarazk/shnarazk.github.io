<template>
  <script type="module">
    import {
      Runtime,
      Inspector
    } from 'https://cdn.jsdelivr.net/npm/@observablehq/runtime@4/dist/runtime.js'
    import notebook from 'https://api.observablehq.com/d/1cbb7a450b192e69.js?v=3'
    new Runtime().module(notebook, Inspector.into(document.body))
  </script>
</template>
