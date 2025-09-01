# Locations Tab

The Locations tab allows affiliates to manage their service areas - the locations where they provide their detailing services.

## Features

- **View Service Areas**: Display all current service locations in a clean grid layout
- **Add New Locations**: Add new cities/states where services are provided
- **Remove Locations**: Delete service areas that are no longer served
- **Validation**: Form validation for city, state, and ZIP code inputs
- **Responsive Design**: Works on desktop and mobile devices

## Components

### LocationsTab
Main component that orchestrates the locations management interface.

### LocationCard
Displays individual service area information with edit/delete actions.

### AddLocationModal
Modal form for adding new service locations with validation.

### DeleteLocationModal
Confirmation modal for removing service locations.

## API Endpoints

The tab uses the following backend endpoints:

- `GET /api/affiliates/:slug/service_areas` - Fetch affiliate's service areas
- `POST /api/affiliates/:slug/service_areas` - Add new service area
- `DELETE /api/affiliates/:slug/service_areas/:areaId` - Remove service area

## Data Structure

Service areas are stored as JSONB arrays in the `affiliates.service_areas` column:

```json
[
  {
    "city": "Los Angeles",
    "state": "CA",
    "zip": "90210",
    "slug": "business-slug"
  }
]
```

## Usage

1. Navigate to the Locations tab in the affiliate dashboard
2. Click "Add Location" to add new service areas
3. Fill in city, state, and optional ZIP code
4. Use the delete button on location cards to remove areas
5. Changes are automatically saved to the database

## Validation

- City and state are required fields
- State must be a 2-letter code (e.g., CA, NY)
- ZIP code is optional but must be valid format if provided
- Duplicate locations are prevented
