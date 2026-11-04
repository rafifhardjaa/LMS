## Summary

- Seed 960 students across 96 classes (10 per class)
- Students list/filter/CRUD endpoints with admin-only routes
- Role-based access: admin sees all, guru sees students in assigned classes, siswa can view self
- Integration with existing classes, majors, and gradeLevel services
- Consistent with existing master data pattern

## Files Changed

- BackEnd/src/db/seed-students.ts
- BackEnd/src/routes/students-route.ts
- BackEnd/src/services/students-service.ts
- BackEnd/src/services/admin-users-service.ts (classId resolution)
- BackEnd/src/index.ts (route registration)

## Verification

- Backend: tsc, seeding, API smoke tests
- Frontend: TypeScript, lint, Next build
