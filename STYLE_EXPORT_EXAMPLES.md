# 🎨 Style Export Examples

## الفرق بين Tailwind و Bootstrap و Inline

---

## 1. Tailwind CSS Export

```json
{
  "styleFramework": "tailwind",
  "forms": {
    "login": [
      {
        "id": "form_123",
        "formGroup": "form_group",
        "containerClass": "container grid grid-cols-4 gap-1 p-2 bg-white border border-slate-200 rounded-lg shadow-sm max-w-7xl mx-auto",
        "controls": [
          {
            "data": {
              "formControlName": "username",
              "fieldType": "input-text",
              "value": null,
              "label": "Username",
              "placeholder": "Enter username",
              "validators": [],
              "required": true,
              "disabled": false,
              "readonly": false
            },
            "class": "col-span-2 w-full"
          }
        ]
      }
    ]
  }
}
```

### ✅ Tailwind Features
- `containerClass`: Tailwind utility classes
- `class`: Grid column span (col-span-1, col-span-2, etc.)
- Uses Tailwind grid system
- Responsive utilities available

---

## 2. Bootstrap Export

```json
{
  "styleFramework": "bootstrap",
  "forms": {
    "login": [
      {
        "id": "form_123",
        "formGroup": "form_group",
        "containerClass": "container row g-2 p-2 bg-white border rounded shadow-sm",
        "controls": [
          {
            "data": {
              "formControlName": "username",
              "fieldType": "input-text",
              "value": null,
              "label": "Username",
              "placeholder": "Enter username",
              "validators": [],
              "required": true,
              "disabled": false,
              "readonly": false
            },
            "class": "col-6 mb-3"
          }
        ]
      }
    ]
  }
}
```

### ✅ Bootstrap Features
- `containerClass`: Bootstrap classes (container, row, etc.)
- `class`: Bootstrap grid (col-3, col-6, col-9, col-12)
- Column mapping:
  - 1 column → `col-3`
  - 2 columns → `col-6`
  - 3 columns → `col-9`
  - 4 columns → `col-12`
- Uses Bootstrap 5 grid system

---

## 3. Inline CSS Export

```json
{
  "styleFramework": "inline",
  "forms": {
    "login": [
      {
        "id": "form_123",
        "formGroup": "form_group",
        "containerStyles": {
          "display": "grid",
          "gridTemplateColumns": "repeat(4, 1fr)",
          "gap": "0.25rem",
          "padding": "0.5rem",
          "backgroundColor": "white",
          "border": "1px solid #e2e8f0",
          "borderRadius": "0.5rem",
          "boxShadow": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
          "maxWidth": "80rem",
          "margin": "0 auto"
        },
        "controls": [
          {
            "data": {
              "formControlName": "username",
              "fieldType": "input-text",
              "value": null,
              "label": "Username",
              "placeholder": "Enter username",
              "validators": [],
              "required": true,
              "disabled": false,
              "readonly": false
            },
            "styles": {
              "gridColumn": "span 2",
              "width": "100%"
            }
          }
        ]
      }
    ]
  }
}
```

### ✅ Inline CSS Features
- `containerStyles`: Object with CSS properties
- `styles`: Object with CSS properties for each field
- NO `containerClass` or `class` properties
- Pure inline styles
- Framework-independent

---

## 📊 Comparison Table

| Feature | Tailwind | Bootstrap | Inline |
|---------|----------|-----------|--------|
| **Container** | `containerClass` | `containerClass` | `containerStyles` |
| **Field Styling** | `class` | `class` | `styles` |
| **Grid System** | Tailwind Grid | Bootstrap Grid | CSS Grid |
| **Column Span** | `col-span-{n}` | `col-{n*3}` | `gridColumn: span {n}` |
| **Dependencies** | Tailwind CSS | Bootstrap 5 | None |
| **File Size** | Small (with purge) | Medium | Smallest |

---

## 🔄 Column Mapping

### Tailwind
```
1 column → col-span-1
2 columns → col-span-2
3 columns → col-span-3
4 columns → col-span-4
```

### Bootstrap
```
1 column → col-3  (25%)
2 columns → col-6  (50%)
3 columns → col-9  (75%)
4 columns → col-12 (100%)
```

### Inline
```
1 column → gridColumn: "span 1"
2 columns → gridColumn: "span 2"
3 columns → gridColumn: "span 3"
4 columns → gridColumn: "span 4"
```

---

## 🎯 Usage in Application

### Rendering with Tailwind
```html
<div [class]="containerClass">
  <div [class]="control.class">
    <input type="text" />
  </div>
</div>
```

### Rendering with Bootstrap
```html
<div [class]="containerClass">
  <div [class]="control.class">
    <input type="text" class="form-control" />
  </div>
</div>
```

### Rendering with Inline
```html
<div [ngStyle]="containerStyles">
  <div [ngStyle]="control.styles">
    <input type="text" />
  </div>
</div>
```

---

## ✅ Implementation Status

- ✅ **Tailwind**: Fully implemented
- ✅ **Bootstrap**: Export implemented
- ✅ **Inline**: Export implemented
- ⏳ **Bootstrap Rendering**: Coming soon
- ⏳ **Inline Rendering**: Coming soon

---

## 🚀 How to Test

### 1. Export with Tailwind
```bash
1. Open app
2. Select "Tailwind CSS"
3. Build form
4. Export JSON
5. Check: uses "class" property
```

### 2. Export with Bootstrap
```bash
1. Open app
2. Select "Bootstrap"
3. Build form
4. Export JSON
5. Check: uses "class" with Bootstrap grid
```

### 3. Export with Inline
```bash
1. Open app
2. Select "Inline CSS"
3. Build form
4. Export JSON
5. Check: uses "styles" object instead of "class"
```

---

## 📝 Notes

- **Tailwind**: Best for modern apps with build process
- **Bootstrap**: Best for traditional apps, familiar to most developers
- **Inline**: Best for email templates or framework-independent use
- All three formats are valid and can be imported back

---

**Last Updated**: 2025-01-17
**Status**: Implemented ✅
