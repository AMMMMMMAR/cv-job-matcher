from typing import Any

def get_gemini_schema(model: Any) -> dict:
    """
    Helper to generate a JSON schema from a Pydantic model and strip all 'default' values.
    This is required because the Gemini API (via google-genai) does not support 
    default values in the response schema.
    """
    if hasattr(model, "model_json_schema"):
        schema = model.model_json_schema()
    else:
        # For older pydantic if applicable
        schema = model.schema()
        
    def strip_defaults(obj):
        if isinstance(obj, dict):
            # Remove 'default' key
            if "default" in obj:
                del obj["default"]
            # Recursively handle nested objects
            for key in list(obj.keys()):
                strip_defaults(obj[key])
        elif isinstance(obj, list):
            for item in obj:
                strip_defaults(item)
                
    strip_defaults(schema)
    return schema
