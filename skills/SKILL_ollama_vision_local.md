---
name: ollama-vision-local
description: Analyze images, figures, and charts using the local Qwen 2.5 VL 3B vision model via Ollama, with automatic dual-provider routing to DeepSeek V4 Flash for final synthesis
---

# Local Vision Analysis Skill — Dual-Provider Routing

## Purpose
This skill enables secure, offline image analysis, figure reading, chart data extraction, and visual scene understanding using the `qwen2.5vl:3b` model running locally via Ollama. It is part of the **Dual-Provider Routing System**:

1. **Main Provider**: DeepSeek V4 Flash Free (via OpenCode) → Handles all standard coding, text, and data tasks.
2. **Vision Provider**: Qwen 2.5 VL 3B (via Ollama) → Used ONLY when images, figures, or visual charts are provided.

### Routing Logic
1. **MONITOR INPUT**: The system evaluates incoming requests and attachments.
2. **DETECT VISUAL DATA**: Identifies if the input contains a figure, image, chart, screenshot, or diagram.
3. **EXECUTE ROUTING**:
   - **Text/code only** → Processed entirely by DeepSeek V4 Flash Free.
   - **Image/figure present** → Routed to `qwen2.5vl:3b` for visual extraction.
4. **SYNTHESIZE**: Once Qwen extracts data from the figure, that text is passed back to DeepSeek V4 Flash Free for the final high-quality response.

## When to Use
- Analyzing image content (objects, scenes, colors, spatial relationships).
- Extracting and reading text from images (OCR via vision models).
- Reading data from charts, graphs, bar plots, scatter plots, and statistical figures.
- Interpreting medical figures, PRISMA flowcharts, forest plots, or funnel plots.
- Comparing multiple images to detect differences or changes.
- Processing sensitive or private visual data offline.
- Batch processing images without API rate limits or billing concerns.

## Required Libraries

```python
import ollama
import json
import os
from pathlib import Path
```

*Note: Ensure Ollama is running in the background and the model is pulled (`ollama pull qwen2.5vl:3b`) before executing.*

## Input Requirements

* **File formats**: JPG, JPEG, PNG, WEBP, GIF, BMP, TIFF, SVG.
* **Image sources**: Local file paths (Ollama natively handles file reading and encoding).
* **Hardware Profile**: Vision tasks are memory-intensive. When processing large batches, monitor your 16 GB of system RAM to prevent out-of-memory errors or system slowdowns.

## Output Schema

Analysis results should be returned as valid JSON conforming to this schema:

```json
{
  "success": true,
  "images_analyzed": 1,
  "provider_chain": ["qwen2.5vl:3b", "deepseek-v4-flash-free"],
  "analysis": {
    "description": "A detailed scene description...",
    "objects": [
      {"name": "bar chart", "type": "statistical figure", "position": "center"}
    ],
    "text_content": "Any text visible in the image...",
    "extracted_data": {
      "chart_type": "bar chart",
      "variables": ["Group A", "Group B"],
      "values": [45.2, 38.7],
      "labels": {"x_axis": "Treatment Group", "y_axis": "Mean Score"}
    },
    "colors": ["blue", "green", "white"],
    "scene_type": "statistical figure"
  },
  "comparison": {
    "differences": ["Object X appeared", "Color changed from A to B"],
    "similarities": ["Background unchanged", "Layout consistent"]
  },
  "metadata": {
    "vision_model": "qwen2.5vl:3b",
    "synthesis_model": "deepseek-v4-flash-free",
    "routing": "dual-provider"
  },
  "warnings": []
}
```

### Field Descriptions

* `success`: Boolean indicating whether analysis completed.
* `images_analyzed`: Number of images processed in the request.
* `provider_chain`: Ordered list of models used (vision extraction → synthesis).
* `analysis.description`: Natural language description of the image content.
* `analysis.objects`: Array of detected objects with attributes.
* `analysis.text_content`: Any text extracted from the image.
* `analysis.extracted_data`: Structured data extracted from charts/figures (when applicable).
* `analysis.colors`: Dominant colors identified.
* `analysis.scene_type`: Classification of the scene.
* `comparison`: Present when multiple images are analyzed; describes differences and similarities.
* `metadata.vision_model`: The local model used for visual extraction.
* `metadata.synthesis_model`: The cloud model used for final synthesis.
* `metadata.routing`: Always `"dual-provider"` when vision is involved.
* `warnings`: Array of any system issues or memory constraints encountered.

## Code Examples

### Dual-Provider Vision Pipeline (Recommended)

This is the primary usage pattern. It uses the `ProviderRouter` to automatically detect images, extract data with Qwen, and synthesize with DeepSeek.

```python
import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent))

from agent_core.provider_router import ProviderRouter

def analyze_with_dual_provider(query, image_paths=None):
    """Route a query through the dual-provider pipeline.
    
    Text-only queries go directly to DeepSeek V4 Flash Free.
    Queries with images go through Qwen 2.5 VL → DeepSeek synthesis.
    """
    router = ProviderRouter()
    result = router.route(
        query=query,
        image_paths=image_paths
    )
    
    print(f"Provider used: {result['provider_used']}")
    print(f"Has vision: {result['has_vision']}")
    
    if result['vision_extractions']:
        print("\n--- Vision Extractions ---")
        for ext in result['vision_extractions']:
            print(ext)
    
    print(f"\n--- Final Response ---")
    print(result['response'])
    
    return result

# Text-only → goes directly to DeepSeek
# analyze_with_dual_provider("Write an introduction about diabetes prevalence")

# With image → Qwen extracts, DeepSeek synthesizes
# analyze_with_dual_provider("Describe the results shown in this figure", ["./figures/fig1.png"])
```

### Direct Qwen 2.5 VL Image Analysis

```python
import ollama

def analyze_local_image(image_path, prompt="Describe this image in detail."):
    """Analyze a local image file using qwen2.5vl:3b vision via Ollama."""
    
    response = ollama.chat(
        model='qwen2.5vl:3b',
        messages=[
            {
                'role': 'user',
                'content': prompt,
                'images': [image_path]
            }
        ]
    )
    return response['message']['content']
```

### Chart/Figure Data Extraction

```python
import ollama

def extract_chart_data(image_path):
    """Extract structured data from a statistical chart or figure."""
    
    prompt = (
        "You are a medical research data extraction assistant. "
        "Analyze this statistical figure/chart carefully. Extract:\n"
        "1. Chart type (bar, scatter, line, forest plot, funnel plot, etc.)\n"
        "2. Axis labels and units\n"
        "3. All data points, values, and group labels visible\n"
        "4. Any p-values, confidence intervals, or effect sizes shown\n"
        "5. The title and any annotations\n"
        "6. Legend entries if present\n\n"
        "Be precise with numbers. Report exactly what you see."
    )
    
    response = ollama.chat(
        model='qwen2.5vl:3b',
        messages=[
            {
                'role': 'user',
                'content': prompt,
                'images': [image_path]
            }
        ]
    )
    return response['message']['content']
```

### Multi-Image Comparison

```python
import ollama

def compare_images(image_paths, comparison_prompt=None):
    """Compare multiple images and identify differences."""
    if comparison_prompt is None:
        comparison_prompt = (
            "Compare these images carefully. "
            "List all differences and similarities you observe. "
            "Describe any changes in objects, colors, positions, or text."
        )
    
    response = ollama.chat(
        model='qwen2.5vl:3b',
        messages=[
            {
                'role': 'user',
                'content': comparison_prompt,
                'images': image_paths
            }
        ]
    )
    return response['message']['content']
```

### Full Analysis with Native JSON Output

```python
import ollama
import json
import os

def analyze_image_to_json(image_path):
    """Perform comprehensive image analysis and return structured JSON."""
    filename = os.path.basename(image_path)
    
    prompt = """Analyze this image and return a JSON object with the following structure:
{
    "description": "detailed scene description",
    "objects": [{"name": "object name", "attributes": "color, size, position"}],
    "text_content": "any visible text or null if none",
    "extracted_data": {"chart_type": "if applicable", "values": [], "labels": {}},
    "colors": ["dominant", "colors"],
    "scene_type": "indoor/outdoor/chart/diagram/etc",
    "people_count": 0,
    "notable_features": ["list of notable visual elements"]
}"""

    try:
        response = ollama.chat(
            model='qwen2.5vl:3b',
            messages=[
                {
                    'role': 'user',
                    'content': prompt,
                    'images': [image_path]
                }
            ],
            format='json'
        )
        
        analysis = json.loads(response['message']['content'])
        
        result = {
            "success": True,
            "filename": filename,
            "analysis": analysis,
            "metadata": {
                "vision_model": "qwen2.5vl:3b",
                "routing": "direct-vision"
            },
            "warnings": []
        }
        
    except json.JSONDecodeError as e:
        result = {
            "success": False,
            "filename": filename,
            "analysis": {"raw_response": response['message']['content']},
            "metadata": {"vision_model": "qwen2.5vl:3b"},
            "warnings": [f"Failed to parse JSON: {str(e)}"]
        }
    except Exception as e:
        result = {
            "success": False,
            "filename": filename,
            "analysis": {},
            "metadata": {},
            "warnings": [f"Analysis failed: {str(e)}"]
        }
    
    return result
```

### Batch Processing Directory

```python
import ollama
import json
from pathlib import Path

def process_image_directory(directory_path, output_file, prompt=None):
    """Process all images in a directory and save results locally."""
    if prompt is None:
        prompt = "Describe this image briefly, including any visible text and data."
    
    image_extensions = {'.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp', '.tiff'}
    results = []
    
    for file_path in sorted(Path(directory_path).iterdir()):
        if file_path.suffix.lower() in image_extensions:
            print(f"Processing: {file_path.name}")
            
            try:
                analysis = analyze_local_image(str(file_path), prompt)
                results.append({
                    "filename": file_path.name,
                    "success": True,
                    "analysis": analysis
                })
            except Exception as e:
                results.append({
                    "filename": file_path.name,
                    "success": False,
                    "error": str(e)
                })
    
    with open(output_file, 'w') as f:
        json.dump(results, f, indent=2)
    
    return results
```

## CLI Usage

The dual-provider routing is available via the CLI:

```bash
# Text-only task → routes to DeepSeek V4 Flash Free
python agent_core/main.py execute "Write an introduction about diabetes"

# Vision task → routes through Qwen 2.5 VL → DeepSeek synthesis
python agent_core/main.py execute-vision "Describe the results in this figure" --image ./figures/fig1.png

# Multiple images
python agent_core/main.py execute-vision "Compare these forest plots" --image ./figures/fig1.png --image ./figures/fig2.png
```

## Streamlit UI Usage

In the Streamlit app (`app.py`), the chat tab includes an image uploader:
1. Type your question in the chat input
2. Optionally upload images via the file uploader above the chat
3. The system automatically detects visual data and routes accordingly
4. Vision extractions from Qwen are shown in an expander
5. The final DeepSeek-synthesized response appears in the chat

## Error Handling & Local Considerations

### Image Resizing for Performance

```python
from PIL import Image

def resize_image_for_local_inference(image_path, max_dimension=1024):
    """Resize image to speed up local inference."""
    with Image.open(image_path) as img:
        if max(img.size) > max_dimension:
            img.thumbnail((max_dimension, max_dimension), Image.Resampling.LANCZOS)
            temp_path = f"temp_resized_{os.path.basename(image_path)}"
            img.save(temp_path, quality=85)
            return temp_path
    return image_path
```

### Provider Availability Checks

```python
from agent_core.provider_router import VisionProvider

vision = VisionProvider()
if vision.is_available():
    print("✅ Qwen 2.5 VL 3B is ready")
else:
    print("❌ Ollama is not running or qwen2.5vl:3b is not pulled")
    print("   Run: ollama pull qwen2.5vl:3b")
```

## Configuration

Provider settings are managed in `agent_core/config.json`:

```json
{
    "MAIN_PROVIDER": "opencode",
    "MAIN_MODEL": "deepseek-v4-flash-free",
    "MAIN_BASE_URL": "http://localhost:3284/v1",
    "VISION_PROVIDER": "ollama",
    "VISION_MODEL": "qwen2.5vl:3b",
    "VISION_BASE_URL": "http://localhost:11434",
    "VISION_ROUTING_ENABLED": true
}
```

## Limitations

* **Inference Speed**: `qwen2.5vl:3b` runs locally — speed depends on your CPU/GPU hardware.
* **Model Size**: The 3B parameter model fits in ~4GB RAM but may struggle with extremely complex medical images.
* **Complex Text Layouts**: Accuracy may drop with highly stylized, rotated, or densely packed text.
* **Medical Imagery**: Not suited for diagnostic analysis — use for data extraction and figure reading only.
* **Background Processes**: Running heavy concurrent applications during inference may cause timeouts.
* **OpenCode Dependency**: The main DeepSeek provider requires the OpenCode application to be running.
