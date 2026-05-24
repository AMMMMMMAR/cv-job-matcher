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
        
    def strip_unsupported_keys(obj):
        if isinstance(obj, dict):
            # Remove 'default' and 'title' keys which Gemini API rejects
            if "default" in obj:
                del obj["default"]
            if "title" in obj:
                del obj["title"]
            # Recursively handle nested objects
            for key in list(obj.keys()):
                strip_unsupported_keys(obj[key])
        elif isinstance(obj, list):
            for item in obj:
                strip_unsupported_keys(item)
                
    strip_unsupported_keys(schema)
    return schema
