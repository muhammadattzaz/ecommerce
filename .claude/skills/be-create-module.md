# Skill: be-create-module

Scaffold a complete NestJS feature module.

## Usage
/be-create-module <module-name>

## Steps
1. Read `.claude/rules/backend.md`
2. Create `backend/src/<module>/` with: module, controller, service, dto/create, dto/update, schemas/schema
3. Register the new module in `backend/src/app.module.ts`

## Output
All files created following backend.md conventions. Controller has guards and Swagger decorators.
Service has CRUD stubs. Schema has timestamps and required indexes. DTOs use class-validator.
