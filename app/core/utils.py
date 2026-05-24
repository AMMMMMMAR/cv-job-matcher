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
        
    defs = schema.pop("$defs", {})
    if not defs:
        defs = schema.pop("definitions", {})
        
    def resolve_and_strip(obj):
        if isinstance(obj, dict):
            # Resolve $ref by inlining
            if "$ref" in obj:
                ref_name = obj["$ref"].split("/")[-1]
                if ref_name in defs:
                    resolved = defs[ref_name].copy()
                    resolve_and_strip(resolved)
                    obj.clear()
                    obj.update(resolved)
                return

            # Remove unsupported keys
            if "default" in obj:
                del obj["default"]
            if "title" in obj:
                del obj["title"]
                
            # Recursively handle nested objects
            for key in list(obj.keys()):
                resolve_and_strip(obj[key])
        elif isinstance(obj, list):
            for item in obj:
                resolve_and_strip(item)
                
    resolve_and_strip(schema)
    return schema
