<template>
    <div>
      <h2>Red-Black Tree</h2>
      <button @click="insertNode">Insert Random Node</button>
      <div class="tree">
        <pre>{{ tree.preorder() }}</pre>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from "vue";
  import { RedBlackTree } from "../red-black-tree"; // Adjust path as needed
  
  export default defineComponent({
    name: "TreeView",
    data() {
      return {
        tree: new RedBlackTree(),
      };
    },
    methods: {
      insertNode() {
        const value = Math.floor(Math.random() * 100);
        this.tree.insert(value);
      },
    },
  });
  </script>
  
  <style>
  .tree {
    margin-top: 20px;
    white-space: pre;
    font-family: monospace;
  }
  </style>
  