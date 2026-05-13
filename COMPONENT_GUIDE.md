# Notely UI Components Guide

This guide explains how to use the reusable UI components in the Notely application.

## Quick Start

All components are located in `Client/src/components/ui/` and can be imported as:

```jsx
import Button from '../components/ui/Button';
import { Button, Input, Card } from '../components/ui';
```

## Components

### 1. Button

A versatile button component with multiple variants and sizes.

**Props:**
- `variant`: 'primary' | 'secondary' | 'danger' | 'outline' (default: 'primary')
- `size`: 'sm' | 'md' | 'lg' (default: 'md')
- `loading`: boolean (shows spinner and disables button)
- `disabled`: boolean
- `onClick`: function
- `className`: string (additional classes)

**Examples:**
```jsx
// Primary button
<Button variant="primary" size="md">Save</Button>

// Danger button
<Button variant="danger" onClick={handleDelete}>Delete</Button>

// Loading state
<Button loading={isSubmitting}>Submitting...</Button>

// Secondary outline
<Button variant="outline">Cancel</Button>
```

---

### 2. Input

Text input component with label and error state support.

**Props:**
- `type`: string (default: 'text')
- `label`: string (optional)
- `placeholder`: string
- `value`: string
- `onChange`: function
- `error`: string (shows error message in red)
- `disabled`: boolean
- `required`: boolean
- `ref`: React ref

**Examples:**
```jsx
// Basic email input
<Input 
  type="email" 
  label="Email" 
  placeholder="user@example.com"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>

// With error
<Input 
  label="Username"
  error={usernameError}
  value={username}
  onChange={(e) => setUsername(e.target.value)}
/>

// Required field
<Input 
  label="Password"
  type="password"
  required
  value={password}
  onChange={(e) => setPassword(e.target.value)}
/>
```

---

### 3. TextArea

Multi-line text input component, similar to Input.

**Props:**
- `label`: string (optional)
- `placeholder`: string
- `value`: string
- `onChange`: function
- `rows`: number (default: 5)
- `error`: string
- `disabled`: boolean
- `ref`: React ref

**Examples:**
```jsx
// Basic textarea
<TextArea 
  label="Note Content"
  placeholder="Write your note here..."
  value={content}
  onChange={(e) => setContent(e.target.value)}
  rows={8}
/>

// With error
<TextArea 
  label="Description"
  error={descriptionError}
  value={description}
  onChange={(e) => setDescription(e.target.value)}
/>
```

---

### 4. Card

Container component for grouping content with shadow and border-radius.

**Props:**
- `children`: React node
- `className`: string (additional classes)

**Examples:**
```jsx
// Basic card
<Card>
  <h2>Card Title</h2>
  <p>Card content goes here</p>
</Card>

// Card with custom styling
<Card className="bg-blue-50">
  <div className="p-6">
    <p>Custom styled content</p>
  </div>
</Card>

// Form in card
<Card>
  <form onSubmit={handleSubmit} className="space-y-4">
    <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
    <Button type="submit">Submit</Button>
  </form>
</Card>
```

---

### 5. NoteCard

Specialized card component for displaying individual notes.

**Props:**
- `title`: string
- `content`: string (automatically truncated to 150 chars)
- `date`: string (ISO date, formatted automatically)
- `tags`: string[] (optional, max 3 shown with +N indicator)
- `onClick`: function (card click handler)
- `actions`: React node (button container)
- `className`: string (additional classes)

**Examples:**
```jsx
// Basic note card
<NoteCard 
  title="My Note"
  content="This is the note content..."
  date={note.createdAt}
  onClick={() => navigate(`/edit/${note._id}`)}
/>

// With actions
<NoteCard 
  title={note.title}
  content={note.content}
  date={note.createdAt}
  tags={['important', 'work', 'urgent']}
  onClick={() => handleNoteClick(note._id)}
  actions={
    <div className="flex gap-2">
      <Button variant="outline" size="sm">Enhance</Button>
      <Button variant="danger" size="sm">Delete</Button>
    </div>
  }
/>

// In grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {notes.map(note => (
    <NoteCard 
      key={note._id}
      title={note.title}
      content={note.content}
      date={note.createdAt}
      onClick={() => navigate(`/edit/${note._id}`)}
    />
  ))}
</div>
```

---

### 6. Badge

Small label/tag component for status or category display.

**Props:**
- `variant`: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'gray' (default: 'primary')
- `size`: 'sm' | 'md' | 'lg' (default: 'md')
- `children`: React node (text or content)
- `className`: string (additional classes)

**Examples:**
```jsx
// Status badge
<Badge variant="success">Active</Badge>

// Small tag
<Badge variant="primary" size="sm">Work</Badge>

// Warning
<Badge variant="warning">In Progress</Badge>

// Error/danger
<Badge variant="error" size="lg">Urgent</Badge>

// In list
<div className="flex gap-2">
  {tags.map(tag => (
    <Badge key={tag} variant="primary" size="sm">{tag}</Badge>
  ))}
</div>
```

---

### 7. Modal

Dialog/modal component for alerts and confirmations.

**Props:**
- `isOpen`: boolean
- `onClose`: function
- `title`: string
- `children`: React node (content)
- `actions`: React node (footer buttons)
- `size`: 'sm' | 'md' | 'lg' | 'xl' (default: 'md')

**Examples:**
```jsx
// Confirmation modal
<Modal 
  isOpen={showConfirm} 
  onClose={() => setShowConfirm(false)}
  title="Confirm Delete"
  actions={
    <>
      <Button variant="secondary" onClick={() => setShowConfirm(false)}>Cancel</Button>
      <Button variant="danger" onClick={handleConfirmDelete}>Delete</Button>
    </>
  }
>
  Are you sure you want to delete this note?
</Modal>

// Alert modal
<Modal 
  isOpen={showAlert}
  onClose={() => setShowAlert(false)}
  title="Error"
  size="sm"
  actions={<Button onClick={() => setShowAlert(false)}>OK</Button>}
>
  <p>{errorMessage}</p>
</Modal>
```

---

### 8. Spinner

Loading indicator component.

**Props:**
- `size`: 'sm' | 'md' | 'lg' (default: 'md')
- `className`: string (additional classes)

**Examples:**
```jsx
// Medium spinner (default)
<Spinner />

// Large spinner
<Spinner size="lg" />

// Small spinner
<Spinner size="sm" />

// In loading state
{isLoading ? (
  <Spinner size="lg" />
) : (
  <div>Content loaded</div>
)}

// Centered
<div className="flex items-center justify-center py-12">
  <Spinner size="lg" />
</div>
```

---

## Common Patterns

### Form with Validation

```jsx
import { useState } from 'react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

export default function MyForm() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    
    try {
      // API call
      const response = await api.post('/login', form);
    } catch (err) {
      setErrors({
        email: err.response?.data?.emailError,
        password: err.response?.data?.passwordError,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          type="email"
          label="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          error={errors.email}
        />
        
        <Input
          type="password"
          label="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          error={errors.password}
        />
        
        <Button type="submit" loading={loading} className="w-full">
          Login
        </Button>
      </form>
    </Card>
  );
}
```

### Grid of Cards

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map(item => (
    <Card key={item.id}>
      <h3 className="font-bold text-lg">{item.title}</h3>
      <p className="text-gray-600 mt-2">{item.description}</p>
      <div className="mt-4 flex gap-2">
        <Button variant="primary" size="sm">Edit</Button>
        <Button variant="danger" size="sm">Delete</Button>
      </div>
    </Card>
  ))}
</div>
```

### Loading State Pattern

```jsx
{isLoading ? (
  <div className="flex items-center justify-center py-12">
    <Spinner size="lg" />
  </div>
) : isEmpty ? (
  <div className="text-center py-12">
    <p className="text-gray-600">No items found</p>
    <Button onClick={handleCreate} className="mt-4">Create One</Button>
  </div>
) : (
  <div className="grid grid-cols-3 gap-6">
    {/* Items */}
  </div>
)}
```

---

## Styling & Customization

All components accept a `className` prop for additional customization:

```jsx
// Custom Button
<Button className="shadow-lg hover:shadow-xl">Custom Button</Button>

// Custom Card
<Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
  Content
</Card>

// Custom Input
<Input label="Custom" className="border-2 border-purple-500 focus:ring-purple-200" />
```

## Tailwind Classes Used

Common Tailwind classes used throughout components:
- Colors: `text-primary-600`, `bg-gray-50`, `border-red-500`
- Spacing: `p-4`, `gap-2`, `mb-3`
- Typography: `font-bold`, `text-sm`, `text-center`
- Layout: `flex`, `grid`, `items-center`
- Effects: `shadow-md`, `rounded-lg`, `opacity-75`
- Responsive: `md:grid-cols-2`, `lg:text-lg`

---

## Tips & Best Practices

1. **Always use semantic HTML** - Buttons are `<button>`, inputs are `<input>`, etc.
2. **Handle loading states** - Use the `loading` prop on buttons during async operations
3. **Show error messages** - Use the `error` prop on inputs for validation feedback
4. **Responsive grids** - Use Tailwind responsive classes: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
5. **Consistent spacing** - Use gap utilities for spacing between elements
6. **Accessibility** - Components include proper ARIA labels and semantic HTML
7. **Customization** - Don't create new components if you can customize with className
8. **Combine components** - Build complex UIs by composing simple components

---

## Color Reference

**Primary Colors:**
- `text-primary-600` - Main brand color
- `bg-primary-600` - Background
- `border-primary-600` - Borders

**Neutral Colors:**
- `text-gray-900` - Primary text
- `text-gray-600` - Secondary text
- `bg-gray-50` - Light background
- `bg-white` - Card backgrounds

**Status Colors:**
- Success: `text-green-600`, `bg-green-100`
- Warning: `text-amber-600`, `bg-amber-100`
- Error: `text-red-600`, `bg-red-100`

---

For more examples, check the page implementations in `Client/src/pages/`.
