# Skill: be-create-endpoint

Add a new endpoint to an existing NestJS module.

## Usage
/be-create-endpoint <module-name> <METHOD> <path> [guard: public|auth|admin]

Example: /be-create-endpoint products GET /featured public

## Steps
1. Read `.claude/rules/backend.md`
2. Read the target controller and service files
3. Add the route handler to the controller (with guard, Swagger decorators)
4. Add the corresponding service method with business logic
5. Add a DTO if the endpoint accepts a body (POST/PATCH)

## Checklist
- [ ] Correct guard applied (none / JwtAuthGuard / JwtAuthGuard + RolesGuard + @Roles('admin'))
- [ ] @ApiOperation and @ApiResponse added
- [ ] Service method throws typed NestJS exceptions
