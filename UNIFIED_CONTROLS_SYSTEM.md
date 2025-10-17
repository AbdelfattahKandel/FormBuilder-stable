# 🎯 Unified Controls System

## المفهوم
نظام موحد للـ controls - نفس الشكل في Builder ونفس الشكل في JSON Export

---

## 🏗️ البنية

### 1. Control Metadata Service
```typescript
interface ControlMetadata {
  type: FieldType;
  component: string;        // اسم الـ component
  defaultValue: any;        // القيمة الافتراضية
  hasOptions: boolean;      // هل يحتاج options؟
  category: string;         // التصنيف
}
```

### 2. Controls Directory Structure
```
controls/
├── primeng-controls/     # PrimeNG components
│   ├── inputtext/
│   ├── password/
│   ├── select/
│   └── ...
└── native-controls/      # Native HTML components
    ├── inputtext/
    ├── password/
    └── ...
```

---

## 🔄 التدفق الموحد

### 1. في الـ Builder (Canvas/Renderer)
```typescript
// استخدام الـ control component مباشرة
<app-inputtext [field]="field" />
<app-select [field]="field" />
<app-datepicker [field]="field" />
```

### 2. في الـ JSON Export
```json
{
  "controls": [
    {
      "data": {
        "formControlName": "username",
        "fieldType": "input-text",      // ✅ نفس الـ type
        "value": "",                    // ✅ نفس default value
        "label": "Username",
        "placeholder": "Enter username"
      },
      "component": "InputtextComponent", // ✅ اسم الـ component
      "class": "col-span-2 w-full"
    }
  ]
}
```

### 3. في الـ Runtime Rendering
```typescript
// Dynamic component loading based on fieldType
const metadata = controlMetadataService.getMetadata(field.fieldType);
const component = metadata.component; // "InputtextComponent"
// Load and render component dynamically
```

---

## 📋 Control Types Mapping

| FieldType | Component | Default Value | Has Options |
|-----------|-----------|---------------|-------------|
| `input-text` | InputtextComponent | `''` | No |
| `password` | PasswordComponent | `''` | No |
| `input-number` | InputnumberComponent | `0` | No |
| `textarea` | TextareaComponent | `''` | No |
| `select` | SelectComponent | `null` | Yes |
| `multi-select` | MultiselectComponent | `[]` | Yes |
| `checkbox` | CheckboxComponent | `false` | No |
| `radio` | RadiobuttonComponent | `null` | Yes |
| `datepicker` | DatepickerComponent | `null` | No |
| `attachment` | AttachmentComponent | `null` | No |
| `array` | ArrayComponent | `[]` | No |
| `submit` | ButtonComponent | `null` | No |

---

## 🎨 UI Kit Support

### PrimeNG
```typescript
uiKit: 'primeng'
→ Load from: controls/primeng-controls/
→ Uses: PrimeNG components (p-inputText, p-dropdown, etc.)
```

### Native HTML
```typescript
uiKit: 'native'
→ Load from: controls/native-controls/
→ Uses: Native HTML elements (input, select, etc.)
```

### Bootstrap (Future)
```typescript
uiKit: 'bootstrap'
→ Load from: controls/bootstrap-controls/
→ Uses: Bootstrap form components
```

---

## 🔧 Implementation Steps

### Step 1: Update FieldConfig
```typescript
export interface FieldConfig {
  // ... existing properties
  component?: string;  // Component name for rendering
  uiKit?: 'primeng' | 'native' | 'bootstrap';
}
```

### Step 2: Update Renderer
```typescript
@Component({
  selector: 'app-renderer',
  template: `
    <ng-container [ngSwitch]="field().type">
      @case ('input-text') {
        <app-inputtext [field]="field()" />
      }
      @case ('select') {
        <app-select [field]="field()" />
      }
      <!-- ... other cases -->
    </ng-container>
  `
})
```

### Step 3: Update Schema Serializer
```typescript
private mapFieldToControl(field: FieldConfig): any {
  const metadata = this._controlMetadata.getMetadata(field.type);
  
  return {
    data: {
      formControlName: field.formControlName,
      fieldType: field.type,
      value: field.value ?? metadata?.defaultValue,
      // ... other properties
    },
    component: metadata?.component,  // ✅ Add component name
    class: field.class
  };
}
```

---

## 📊 JSON Structure (Final)

```json
{
  "styleFramework": "tailwind",
  "uiKit": "primeng",
  "forms": {
    "login": [
      {
        "id": "form_123",
        "formGroup": "form_group",
        "containerClass": "container grid grid-cols-4 gap-1",
        "controls": [
          {
            "data": {
              "formControlName": "username",
              "fieldType": "input-text",
              "value": "",
              "label": "Username",
              "placeholder": "Enter username",
              "required": true
            },
            "component": "InputtextComponent",
            "class": "col-span-2 w-full"
          },
          {
            "data": {
              "formControlName": "password",
              "fieldType": "password",
              "value": "",
              "label": "Password",
              "required": true
            },
            "component": "PasswordComponent",
            "class": "col-span-2 w-full"
          },
          {
            "data": {
              "formControlName": "country",
              "fieldType": "select",
              "value": null,
              "label": "Country",
              "options": [
                { "label": "Egypt", "value": "eg" },
                { "label": "USA", "value": "us" }
              ]
            },
            "component": "SelectComponent",
            "class": "col-span-4 w-full"
          }
        ]
      }
    ]
  }
}
```

---

## ✅ Benefits

1. **Consistency**: نفس الشكل في Builder و JSON
2. **Type Safety**: كل control له metadata واضحة
3. **Extensibility**: سهل إضافة controls جديدة
4. **UI Kit Switching**: سهل التبديل بين PrimeNG/Native/Bootstrap
5. **Dynamic Rendering**: يمكن render الـ JSON ديناميكياً

---

## 🚀 Next Steps

1. ✅ Create ControlMetadataService
2. ⏳ Update Renderer to use actual control components
3. ⏳ Update SchemaSerializer to include component names
4. ⏳ Test with all field types
5. ⏳ Add UI Kit switching logic

---

**Status**: In Progress 🔄
**Last Updated**: 2025-01-17
