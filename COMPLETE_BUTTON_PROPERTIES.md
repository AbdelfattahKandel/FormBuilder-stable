# 🎯 Complete Button Properties

## ✅ All Button Properties

### Full JSON Structure
```json
{
  "data": {
    "fieldType": "submit",
    "label": "Submit Form",
    "buttonType": "submit",
    "buttonAction": "submit",
    "buttonClass": "custom-btn",
    "buttonStyle": {
      "backgroundColor": "#007bff",
      "color": "white"
    },
    "buttonIcon": "pi pi-check",
    "buttonIconPos": "right",
    "buttonLoading": false,
    "buttonDisabled": false,
    "buttonSize": "medium",
    "buttonSeverity": "primary"
  },
  "class": "col-span-4 w-full"
}
```

---

## 📋 Property Reference

| Property | Type | Values | Description |
|----------|------|--------|-------------|
| `buttonType` | string | `submit`, `button`, `reset` | HTML button type |
| `buttonAction` | string | Any string | Custom action identifier |
| `buttonClass` | string | CSS classes | Additional CSS classes |
| `buttonStyle` | object | CSS properties | Inline styles |
| `buttonIcon` | string | PrimeIcons | Icon class (e.g., `pi pi-check`) |
| `buttonIconPos` | string | `left`, `right` | Icon position |
| `buttonLoading` | boolean | `true`, `false` | Show loading spinner |
| `buttonDisabled` | boolean | `true`, `false` | Disable button |
| `buttonSize` | string | `small`, `medium`, `large` | Button size |
| `buttonSeverity` | string | `primary`, `secondary`, `success`, `info`, `warning`, `danger`, `help` | Button color theme |

---

## 🎨 Button Severity (Colors)

| Severity | Color | Use Case |
|----------|-------|----------|
| `primary` | Blue | Main actions |
| `secondary` | Gray | Secondary actions |
| `success` | Green | Positive actions (Save, Submit) |
| `info` | Cyan | Informational actions |
| `warning` | Orange | Warning actions |
| `danger` | Red | Destructive actions (Delete, Cancel) |
| `help` | Purple | Help/Support actions |

---

## 📐 Button Sizes

| Size | Description |
|------|-------------|
| `small` | Compact button |
| `medium` | Default size |
| `large` | Prominent button |

---

## 🎯 Complete Examples

### Example 1: Primary Submit Button
```json
{
  "data": {
    "fieldType": "submit",
    "label": "Submit Form",
    "buttonType": "submit",
    "buttonAction": "submit",
    "buttonIcon": "pi pi-check",
    "buttonIconPos": "right",
    "buttonSize": "large",
    "buttonSeverity": "primary",
    "buttonLoading": false,
    "buttonDisabled": false
  }
}
```

### Example 2: Save Draft Button
```json
{
  "data": {
    "fieldType": "submit",
    "label": "Save Draft",
    "buttonType": "button",
    "buttonAction": "save",
    "buttonIcon": "pi pi-save",
    "buttonIconPos": "left",
    "buttonSize": "medium",
    "buttonSeverity": "secondary",
    "buttonLoading": false,
    "buttonDisabled": false
  }
}
```

### Example 3: Delete Button
```json
{
  "data": {
    "fieldType": "submit",
    "label": "Delete",
    "buttonType": "button",
    "buttonAction": "delete",
    "buttonIcon": "pi pi-trash",
    "buttonIconPos": "left",
    "buttonSize": "small",
    "buttonSeverity": "danger",
    "buttonLoading": false,
    "buttonDisabled": false
  }
}
```

### Example 4: Loading Button
```json
{
  "data": {
    "fieldType": "submit",
    "label": "Processing...",
    "buttonType": "button",
    "buttonAction": "process",
    "buttonIcon": "pi pi-spin pi-spinner",
    "buttonIconPos": "left",
    "buttonSize": "medium",
    "buttonSeverity": "info",
    "buttonLoading": true,
    "buttonDisabled": true
  }
}
```

### Example 5: Custom Styled Button
```json
{
  "data": {
    "fieldType": "submit",
    "label": "Custom Button",
    "buttonType": "button",
    "buttonAction": "custom",
    "buttonClass": "my-custom-btn",
    "buttonStyle": {
      "backgroundColor": "#ff6b6b",
      "color": "white",
      "borderRadius": "20px",
      "padding": "12px 24px"
    },
    "buttonIcon": "pi pi-star",
    "buttonIconPos": "right",
    "buttonSize": "medium",
    "buttonSeverity": "primary"
  }
}
```

---

## 🔧 Field Editor UI

### Button Properties Section
```
┌─────────────────────────────────────┐
│ Button Properties                   │
├─────────────────────────────────────┤
│ Button Action: [submit          ]  │
│ Button Icon:    [pi pi-check     ]  │
│ Icon Position:  [Right ▼]          │
│ Button Size:    [Medium ▼]         │
│ Button Color:   [Primary ▼]        │
└─────────────────────────────────────┘
```

---

## 🎯 Usage in PrimeNG

### Rendering Button
```html
<p-button
  [label]="field.label"
  [type]="field.buttonType"
  [icon]="field.buttonIcon"
  [iconPos]="field.buttonIconPos"
  [loading]="field.buttonLoading"
  [disabled]="field.buttonDisabled"
  [size]="field.buttonSize"
  [severity]="field.buttonSeverity"
  [styleClass]="field.buttonClass"
  [style]="field.buttonStyle"
  (onClick)="onButtonClick(field.buttonAction)"
></p-button>
```

---

## 📊 Default Values

When adding a submit button to canvas:
```typescript
{
  buttonType: 'submit',
  buttonAction: 'submit',
  buttonIcon: 'pi pi-check',
  buttonIconPos: 'right',
  buttonSize: 'medium',
  buttonSeverity: 'primary',
  buttonLoading: false,
  buttonDisabled: false
}
```

---

## ✅ Implementation Checklist

- [x] FieldConfig interface updated
- [x] FieldControlData interface updated
- [x] Canvas component sets defaults
- [x] SchemaSerializerService exports all properties
- [x] FieldEditorDialog form includes all fields
- [x] FieldEditorDialog template has UI for all properties
- [x] Dropdown options for size, severity, icon position
- [x] Import logic handles all properties

---

## 🧪 Testing

```bash
# 1. Add Submit Button
- Drag "Submit Button" to canvas
- Check defaults:
  ✓ buttonIcon: "pi pi-check"
  ✓ buttonSize: "medium"
  ✓ buttonSeverity: "primary"

# 2. Edit Button
- Click Edit
- See "Button Properties" section
- Change:
  - Icon: "pi pi-save"
  - Size: "large"
  - Color: "success"
- Save

# 3. Export JSON
- Click "View JSON"
- Verify all properties exported:
  ✓ buttonIcon
  ✓ buttonIconPos
  ✓ buttonSize
  ✓ buttonSeverity
  ✓ buttonAction
```

---

## 🎉 Complete!

**All button properties are now fully implemented!**

- ✅ 10 button-specific properties
- ✅ Full UI in Field Editor
- ✅ Export/Import support
- ✅ Default values
- ✅ Type-safe interfaces

---

**Last Updated**: 2025-01-17
**Status**: Complete ✅
