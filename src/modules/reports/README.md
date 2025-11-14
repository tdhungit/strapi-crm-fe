# Query Builder Module

This module implements a visual query builder using `@react-awesome-query-builder/antd`.

## Features

- Visual query builder interface with drag-and-drop
- Automatic field detection from Strapi content types
- Support for multiple field types (text, number, date, boolean, select)
- Relation field support with nested queries
- Export queries to multiple formats (JSON Logic, SQL, Strapi filters)
- Real-time query preview

## Usage

```tsx
import QueryBuilder from './components/QueryBuilder';

<QueryBuilder
  module='your-collection-name'
  onChange={(tree, config) => {
    // Handle query changes
  }}
/>;
```

## Query Export

Use the utility functions to export queries:

```tsx
import { exportQuery, toStrapiFilters } from './utils/queryExport';

const exported = exportQuery(tree, config);
const strapiFilters = toStrapiFilters(tree, config);
```

## Supported Field Types

- String fields (text, email, uid, etc.)
- Numeric fields (integer, float, decimal)
- Date/time fields
- Boolean fields
- Enumeration fields (with dropdown options)
- Relation fields (nested queries on related content types)

## Relation Fields

Relation fields are displayed as nested groups in the query builder. You can query fields from related content types using dot notation.

Example: If you have a `posts` collection with a relation to `users`, you can create queries like:

- `user.email == "example@email.com"`
- `user.createdAt > "2024-01-01"`
- `category.name contains "Technology"`

The query builder automatically detects relation fields and loads the related content type's fields as subfields.
