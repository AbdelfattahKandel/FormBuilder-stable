# Formify v1.2 - Modern Architecture

## 🏗️ Architecture Overview

معمارية متطورة قابلة للتوسع مبنية على مبادئ **Clean Architecture** و **Domain-Driven Design**.

### 📋 Data Structure
```json
{
  "styleFramework": "tailwind",
  "forms": {
    "groupName": [
      {
        "id": "form_id",
        "formGroup": "form_group",
        "containerClass": "tailwind classes",
        "controls": [...]
      }
    ]
  }
}
```

**لا يوجد صفحات متعددة** - فقط مجموعات (Groups) داخل صفحة واحدة.

---

## 📐 Core Principles

### 1. **Separation of Concerns**
- فصل واضح بين Business Logic و UI و Data
- كل طبقة لها مسؤولية واحدة فقط

### 2. **Dependency Injection**
- استخدام Angular DI بشكل كامل
- `inject()` بدلاً من constructor injection
- Services قابلة للاختبار والاستبدال

### 3. **Reactive Programming**
- RxJS Observables للبيانات المتدفقة (prefix: `$`)
- Signals للحالة المحلية
- State Management Pattern

### 4. **Plugin Architecture**
- نظام تسجيل الحقول (Field Registry)
- إمكانية إضافة حقول جديدة بدون تعديل الكود الأساسي

### 5. **Angular 19 Standards**
- Standalone Components فقط (NO NgModules)
- `ChangeDetectionStrategy.OnPush` إجباري
- `@if`, `@for`, `@switch` بدلاً من `*ngIf`, `*ngFor`
- Reactive Forms فقط (NO Template-driven)
- NO `any` type - Strict typing
- NO `ngClass`/`ngStyle` - استخدم `[class]`/`[style]`

---

## 📁 Project Structure

```
src/app/
├── core/                           # Core Module (Singleton Services)
│   ├── models/                     # Domain Models
│   │   ├── field.model.ts          # Field Domain Model
│   │   ├── form-schema.model.ts    # Form Schema Model (NO Pages)
│   │   ├── group.model.ts          # Group Model
│   │   └── validation.model.ts     # Validation Rules
│   │
│   ├── services/                   # Business Logic Services
│   │   ├── state/                  # State Management (Signals + RxJS)
│   │   │   ├── form-builder.state.ts    # Main state
│   │   │   ├── group.state.ts           # Groups state
│   │   │   └── selection.state.ts       # Selection state
│   │   │
│   │   ├── field-registry/         # Field Registration System
│   │   │   ├── field-registry.service.ts
│   │   │   ├── field-factory.service.ts
│   │   │   └── field-validator.service.ts
│   │   │
│   │   ├── form-builder/           # Form Building Logic
│   │   │   ├── form-builder.service.ts
│   │   │   ├── schema-builder.service.ts
│   │   │   └── schema-serializer.service.ts
│   │   │
│   │   ├── group-management/       # Group Management
│   │   │   └── group-manager.service.ts
│   │   │
│   │   └── export/                 # Export/Import Logic
│   │       ├── json-exporter.service.ts
│   │       └── json-importer.service.ts
│   │
│   └── interfaces/                 # Core Interfaces
│       ├── field-config.interface.ts
│       ├── field-renderer.interface.ts
│       ├── field-plugin.interface.ts
│       └── form-schema.interface.ts
│
├── features/                       # Feature Modules
│   └── form-builder/               # Form Builder Feature (Single Page)
│       ├── components/
│       │   ├── builder-canvas/     # Main Canvas
│       │   ├── field-palette/      # Toolbox
│       │   ├── field-editor/       # Properties Editor
│       │   ├── group-selector/     # Group Selector
│       │   └── toolbar/            # Actions Toolbar
│       │
│       ├── services/               # Feature-specific Services
│       │   ├── drag-drop.service.ts
│       │   └── canvas.service.ts
│       │
│       └── form-builder.routes.ts
│
├── shared/                         # Shared Module
│   ├── components/                 # Reusable UI Components
│   │   ├── field-renderers/       # Field Rendering Components
│   │   │   ├── base-field/        # Base Field Renderer
│   │   │   ├── text-field/
│   │   │   ├── select-field/
│   │   │   ├── date-field/
│   │   │   ├── checkbox-field/
│   │   │   ├── radio-field/
│   │   │   ├── textarea-field/
│   │   │   ├── number-field/
│   │   │   ├── password-field/
│   │   │   ├── multi-select-field/
│   │   │   ├── attachment-field/
│   │   │   └── array-field/
│   │   │
│   │   └── ui/                    # Generic UI Components
│   │       ├── json-viewer/
│   │       └── export-dialog/
│   │
│   ├── directives/                # Reusable Directives
│   │   └── drag-drop.directive.ts
│   │
│   ├── pipes/                     # Reusable Pipes
│   │   └── field-type.pipe.ts
│   │
│   └── utils/                     # Utility Functions
│       ├── form.utils.ts
│       ├── validation.utils.ts
│       └── uuid.utils.ts
│
└── layout/                        # Layout Components
    └── app-shell/                 # Main Shell
```

---

## 🔄 Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         UI Layer                            │
│  (Components - Presentation Only)                           │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    State Layer                              │
│  (Signals + RxJS - Reactive State Management)               │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  Service Layer                              │
│  (Business Logic - Pure Functions)                          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                   Domain Layer                              │
│  (Models - Domain Entities)                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Key Design Patterns

### 1. **State Management Pattern**
```typescript
// Centralized State with Signals
export class FormBuilderState {
  private readonly _fields = signal<FieldModel[]>([]);
  private readonly _selectedField = signal<FieldModel | null>(null);
  
  readonly fields = this._fields.asReadonly();
  readonly selectedField = this._selectedField.asReadonly();
  
  addField(field: FieldModel): void {
    this._fields.update(fields => [...fields, field]);
  }
}
```

### 2. **Field Registry Pattern**
```typescript
// Plugin-based Field Registration
export class FieldRegistryService {
  private readonly registry = new Map<FieldType, FieldPlugin>();
  
  register(type: FieldType, plugin: FieldPlugin): void {
    this.registry.set(type, plugin);
  }
  
  getPlugin(type: FieldType): FieldPlugin | undefined {
    return this.registry.get(type);
  }
}
```

### 3. **Factory Pattern**
```typescript
// Field Factory for creating field instances
export class FieldFactoryService {
  createField(config: FieldConfig): FieldModel {
    const plugin = this.registry.getPlugin(config.type);
    return plugin.create(config);
  }
}
```

### 4. **Strategy Pattern**
```typescript
// Different validation strategies
export interface ValidationStrategy {
  validate(value: unknown): ValidationResult;
}

export class RequiredValidator implements ValidationStrategy {
  validate(value: unknown): ValidationResult {
    return { valid: !!value, message: 'Field is required' };
  }
}
```

---

## 🔌 Plugin Architecture

### Field Plugin Interface
```typescript
export interface FieldPlugin {
  type: FieldType;
  metadata: FieldMetadata;
  
  create(config: FieldConfig): FieldModel;
  render(field: FieldModel): ComponentType;
  validate(field: FieldModel): ValidationResult;
}
```

### Registering New Field Types
```typescript
// Easy to add new field types
const customFieldPlugin: FieldPlugin = {
  type: 'custom-field',
  metadata: { label: 'Custom Field', icon: 'pi-custom' },
  create: (config) => new CustomFieldModel(config),
  render: (field) => CustomFieldComponent,
  validate: (field) => ({ valid: true })
};

fieldRegistry.register('custom-field', customFieldPlugin);
```

---

## 📊 State Management

### State Structure
```typescript
interface AppState {
  formBuilder: {
    pages: PageModel[];
    currentPage: string;
    fields: FieldModel[];
    selectedField: FieldModel | null;
    isDirty: boolean;
  };
  
  ui: {
    theme: 'light' | 'dark';
    sidebarOpen: boolean;
    loading: boolean;
  };
}
```

### State Access
```typescript
// Component access to state
export class CanvasComponent {
  private readonly state = inject(FormBuilderState);
  
  readonly fields = this.state.fields;
  readonly selectedField = this.state.selectedField;
}
```

---

## 🧪 Testing Strategy

### Unit Tests
- Services: Pure functions, easy to test
- State: Test state transitions
- Validators: Test validation logic

### Integration Tests
- Feature modules: Test feature workflows
- Components: Test component interactions

### E2E Tests
- User workflows: Drag & drop, edit, export

---

## 🚀 Performance Optimizations

### 1. **OnPush Change Detection**
- All components use OnPush strategy
- Immutable state updates

### 2. **Lazy Loading**
- Feature modules loaded on demand
- Code splitting for better performance

### 3. **Virtual Scrolling**
- For large field lists
- CDK Virtual Scroll

### 4. **Memoization**
- Computed signals for derived state
- Pure pipes for transformations

---

## 📝 Code Standards

### Naming Conventions
```typescript
// Services
export class FieldRegistryService { }

// State
export class FormBuilderState { }

// Models
export class FieldModel { }

// Interfaces
export interface FieldConfig { }

// Components
export class FieldEditorComponent { }
```

### File Structure
```
feature-name/
├── feature-name.component.ts
├── feature-name.component.html
├── feature-name.component.css
├── feature-name.component.spec.ts
└── index.ts
```

---

## 🔐 Type Safety

### Strict TypeScript
```typescript
// No 'any' types allowed
// Strict null checks
// Strict property initialization

export interface FieldConfig {
  type: FieldType;              // Union type
  label: string;                // Required
  value?: unknown;              // Optional
  validators?: ValidatorConfig[]; // Optional array
}
```

---

## 📚 Documentation

### Code Documentation
- JSDoc comments for public APIs
- README for each feature module
- Architecture decision records (ADRs)

### API Documentation
- Service interfaces documented
- State management documented
- Plugin system documented

---

## 🎨 UI/UX Principles

### 1. **Responsive Design**
- Mobile-first approach
- Tailwind responsive utilities

### 2. **Accessibility**
- ARIA labels
- Keyboard navigation
- Screen reader support

### 3. **Consistent Design System**
- PrimeNG components
- Custom theme variables
- Reusable UI components

---

## 🔄 Migration from Old Architecture

### Key Improvements
1. **Better Separation of Concerns**: Clear layers
2. **Type Safety**: No 'any' types
3. **Testability**: Pure functions, DI
4. **Extensibility**: Plugin architecture
5. **Maintainability**: Clean code, documentation
6. **Performance**: OnPush, lazy loading

### Breaking Changes
- New state management
- New field registration system
- New component structure

---

## 🎯 Future Enhancements

1. **Undo/Redo System**
2. **Collaborative Editing**
3. **Form Templates Library**
4. **Advanced Validation Rules**
5. **Conditional Logic Builder**
6. **API Integration Builder**
7. **Form Analytics**
8. **Multi-language Support**

---

## 📖 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run tests
npm test

# Build for production
npm run build
```

---

## 🤝 Contributing

Follow the architecture guidelines and coding standards outlined in this document.
