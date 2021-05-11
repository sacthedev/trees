### basic_tree
- id
- created_at - datetime
- updated_at - datetime
- primary_name - string
- scientific_name - string
- botanical_description - string
- field_characteristics - string

### vernacular_name
- id
- created_at - datetime
- updated_at - datetime
- vernacular_name - string

### vernacular_name_reference

- id
- created_at - datetime
- updated_at - datetime
- basic_tree_id
- vernacular_name_id


## backend
- [*] convert database to POSTGres
- [ ] fix create and update date function
- [**] convert common name to primary name
- [*****] add vernacular names for each tree
- [ ] add literature column
- [*] add botanical description
- [*] add field characteristics
- [*] CRUD for vernacular_name
- [*] CRUD for vernacular_name_reference
- [*] CRUD for basic_tree with vernacular_names a part of it i.e. also adding

## frontend
- [ ] implement option to add vernacular names when creating a new tree
- [ ] implement option to delete or update vernacular names when updating a new tree
