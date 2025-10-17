# Formify v1.2 - Application Flow Map

## 🔄 User Journey Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    1. GET STARTED PAGE                          │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Step 1: Choose Style Framework                           │  │
│  │  ○ Tailwind CSS (default)                                 │  │
│  │  ○ Bootstrap                                              │  │
│  │  ○ Inline CSS                                             │  │
│  └───────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Step 2: Choose UI Kit                                    │  │
│  │  ○ PrimeNG (default)                                      │  │
│  │  ○ Native HTML Elements                                   │  │
│  └───────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  [Start Building] Button                                  │  │
│  │  → Save preferences to localStorage                       │  │
│  │  → Navigate to /builder                                   │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    2. BUILDER PAGE (Single Page)                │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  TOOLBAR (Top)                                            │  │
│  │  [Add Group] [Export JSON] [Import JSON] [Theme Toggle]  │  │
│  └───────────────────────────────────────────────────────────┘  │
│  ┌──────────────┬────────────────────────────────────────────┐  │
│  │   PALETTE    │         CANVAS AREA                        │  │
│  │   (Left)     │                                            │  │
│  │              │  ┌──────────────────────────────────────┐  │  │
│  │ ┌──────────┐ │  │  GROUP SELECTOR (Tabs)               │  │  │
│  │ │Text Input│ │  │  [login] [register] [+]              │  │  │
│  │ └──────────┘ │  └──────────────────────────────────────┘  │  │
│  │ ┌──────────┐ │                                            │  │
│  │ │Password  │ │  ┌──────────────────────────────────────┐  │  │
│  │ └──────────┘ │  │  DROP ZONE (Current Group)           │  │  │
│  │ ┌──────────┐ │  │                                      │  │  │
│  │ │Select    │ │  │  [Dropped Fields Here]               │  │  │
│  │ └──────────┘ │  │  - Click to select                   │  │  │
│  │ ┌──────────┐ │  │  - Double-click to edit              │  │  │
│  │ │Checkbox  │ │  │  - Drag to reorder                   │  │  │
│  │ └──────────┘ │  │                                      │  │  │
│  │ ┌──────────┐ │  └──────────────────────────────────────┘  │  │
│  │ │Date      │ │                                            │  │
│  │ └──────────┘ │  ┌──────────────────────────────────────┐  │  │
│  │ ┌──────────┐ │  │  FIELD EDITOR (Right Panel/Modal)    │  │  │
│  │ │Textarea  │ │  │  - Label, Key, Type                  │  │  │
│  │ └──────────┘ │  │  - Placeholder, Value                │  │  │
│  │ ┌──────────┐ │  │  - Required, Disabled, Readonly      │  │  │
│  │ │Number    │ │  │  - Validators, Options               │  │  │
│  │ └──────────┘ │  │  - Style (columns, width, classes)   │  │  │
│  │ ┌──────────┐ │  │  [Save] [Cancel]                     │  │  │
│  │ │Array     │ │  └──────────────────────────────────────┘  │  │
│  │ └──────────┘ │                                            │  │
│  │ ┌──────────┐ │                                            │  │
│  │ │Submit    │ │                                            │  │
│  │ └──────────┘ │                                            │  │
│  └──────────────┴────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                   BuilderPreferencesService                 │
│  - styleChoice: Signal<'tailwind'|'bootstrap'|'inline'>    │
│  - uiKitChoice: Signal<'primeng'|'native'>                 │
│  - saveToLocalStorage()                                     │
│  - loadFromLocalStorage()                                   │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   FieldRegistryService                      │
│  - registerField(type, config)                             │
│  - getFieldsByUiKit(uiKit): FieldConfig[]                  │
│  - createFieldInstance(type): FieldConfig                  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   GroupManagerService                       │
│  - groups: Signal<Map<string, FieldConfig[]>>              │
│  - currentGroup: Signal<string>                            │
│  - addGroup(name)                                           │
│  - removeGroup(name)                                        │
│  - selectGroup(name)                                        │
│  - addFieldToGroup(groupName, field)                       │
│  - removeFieldFromGroup(groupName, fieldId)                │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   FormBuilderService                        │
│  - buildFormGroup(fields): FormGroup                       │
│  - updateFieldValue(fieldId, value)                        │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   SchemaSerializerService                   │
│  - export(): JSON                                           │
│    {                                                        │
│      styleFramework: string,                               │
│      forms: {                                              │
│        groupName: [{ id, formGroup, controls, ... }]      │
│      }                                                      │
│    }                                                        │
│  - import(json): void                                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Component Interaction

```
GetStartedComponent
    ↓ (user selects preferences)
    ↓ (saves to BuilderPreferencesService)
    ↓ (navigates to /builder)
    ↓
BuilderShellComponent
    ├─→ ToolbarComponent
    │     ├─→ [Add Group] → GroupManagerService.addGroup()
    │     ├─→ [Export] → SchemaSerializerService.export()
    │     └─→ [Import] → SchemaSerializerService.import()
    │
    ├─→ GroupSelectorComponent
    │     ├─→ Display tabs from GroupManagerService.groups
    │     └─→ Switch group → GroupManagerService.selectGroup()
    │
    ├─→ PaletteComponent
    │     ├─→ Get tools from FieldRegistryService
    │     └─→ Filter by BuilderPreferencesService.uiKitChoice
    │
    ├─→ CanvasComponent
    │     ├─→ Display fields from GroupManagerService.currentGroupFields
    │     ├─→ Handle drag & drop (CdkDragDrop)
    │     ├─→ Select field → open FieldEditorComponent
    │     └─→ Update FormGroup via FormBuilderService
    │
    └─→ FieldEditorComponent (Dialog/Sidebar)
          ├─→ Edit field properties
          └─→ Save → update GroupManagerService
```

---

## 🔌 Field Registry Structure

```typescript
// Field Registry Map
{
  'primeng': {
    'input-text': PrimeNGTextFieldConfig,
    'password': PrimeNGPasswordFieldConfig,
    'select': PrimeNGSelectFieldConfig,
    'checkbox': PrimeNGCheckboxFieldConfig,
    'datepicker': PrimeNGDateFieldConfig,
    'textarea': PrimeNGTextareaFieldConfig,
    'input-number': PrimeNGNumberFieldConfig,
    'multi-select': PrimeNGMultiSelectFieldConfig,
    'radio': PrimeNGRadioFieldConfig,
    'attachment': PrimeNGAttachmentFieldConfig,
    'array': PrimeNGArrayFieldConfig,
    'submit': PrimeNGSubmitFieldConfig
  },
  'native': {
    'input-text': NativeTextFieldConfig,
    'password': NativePasswordFieldConfig,
    'select': NativeSelectFieldConfig,
    'checkbox': NativeCheckboxFieldConfig,
    'datepicker': NativeDateFieldConfig,
    'textarea': NativeTextareaFieldConfig,
    'input-number': NativeNumberFieldConfig,
    'multi-select': NativeMultiSelectFieldConfig,
    'radio': NativeRadioFieldConfig,
    'attachment': NativeAttachmentFieldConfig,
    'array': NativeArrayFieldConfig,
    'submit': NativeSubmitFieldConfig
  }
}
```

---

## 📦 Export/Import JSON Structure

### Export Format
```json
{
  "styleFramework": "tailwind",
  "forms": {
    "login": [
      {
        "id": "form_317",
        "formGroup": "form_group",
        "containerClass": "container grid grid-cols-4 gap-1 p-2",
        "controls": [
          {
            "data": {
              "formControlName": "userName",
              "fieldType": "input-text",
              "value": null,
              "label": "User Name",
              "placeholder": "Enter your User Name",
              "options": [],
              "validators": []
            },
            "class": "col-span-2 w-full"
          }
        ]
      }
    ],
    "register": [...]
  }
}
```

---

## 🎨 Styling Strategy

### Tailwind (Default)
- Use `containerClass` and `class` directly from JSON
- Apply Tailwind utilities as-is

### Bootstrap
- Map Tailwind classes to Bootstrap equivalents
- Use utility service for class conversion

### Inline CSS
- Convert classes to inline styles
- Generate style objects dynamically

---

## 🔄 State Management Flow

```
User Action → Component → Service (Signal Update) → Component (Auto Re-render)
                                ↓
                          localStorage (persist)
```

### Example: Adding a Field
```
1. User drags field from Palette
2. CanvasComponent.drop() event
3. GroupManagerService.addFieldToGroup(currentGroup, field)
4. groups Signal updates
5. CanvasComponent auto re-renders (OnPush + Signal)
6. FormBuilderService.buildFormGroup() creates FormGroup
```

---

## 🧪 Testing Strategy

### Unit Tests
- Services: Test state management, CRUD operations
- Utilities: Test pure functions

### Integration Tests
- Component interactions
- Drag & drop functionality
- Form building logic

### E2E Tests
- Complete user flow: Get Started → Build Form → Export
- Import existing JSON
- Switch between groups

---

## 🚀 Performance Optimizations

1. **OnPush Change Detection**: All components
2. **Signals**: Reactive state without zone.js overhead
3. **Lazy Loading**: Feature modules
4. **Virtual Scrolling**: Large field lists (if needed)
5. **Memoization**: Computed signals for derived state

---

## 📝 Implementation Checklist

- [x] Project structure created
- [x] Core services generated
- [x] Components generated
- [ ] BuilderPreferencesService implementation
- [ ] FieldRegistryService implementation
- [ ] GroupManagerService implementation
- [ ] FormBuilderService implementation
- [ ] SchemaSerializerService implementation
- [ ] GetStartedComponent implementation
- [ ] BuilderShellComponent implementation
- [ ] PaletteComponent implementation
- [ ] CanvasComponent implementation
- [ ] RendererComponent implementation
- [ ] Field Editor implementation
- [ ] Routes configuration
- [ ] Import/Export functionality
- [ ] Testing
