---
layout: page-layout.html
title: Blog
---

<ul class="post-list">
    {%- for post in collections.post -%}
    <li class="post-list-item">
        <a href="{{ post.url | url }}">{{ post.data.title }}</a>
        <span class="post-list-date">{{ post.date | date: "yyyy-MM-dd" }}</span>
    </li>
    {%- else -%}
    <li>No blog posts yet.</li>
    {%- endfor -%}
</ul> 
