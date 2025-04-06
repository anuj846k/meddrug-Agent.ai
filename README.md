# 🧠 MedDrug Agent — Simplifying Drug Discovery with AI

![](https://i.imgur.com/aACqD8s.png)


Finding new medicines is a slow and expensive process, often taking over 20 years and costing billions of dollars. Scientists use trial-and-error methods that aren’t efficient. AI and computers can help speed up this process by predicting useful drug compounds before physical testing. However, most AI models work separately, making it hard to use them together.  

MedDrug Agent is a unified drug analysis platform powered by Agent AI. It helps researchers and drug developers by transforming complex data into actionable insights — fast, safely, and intelligently.

***DATASETS USED:***

🧬 *PubChem* – Generates new drug molecules based on AI training from millions of known compounds.  
🛠 *DeepPurpose* – Checks how well a drug binds to a target protein (key to effectiveness).  
🧠 *chemBERTa* – Creates a "map" of drug molecules to find similar ones.


---

## 💡 What Can People Use It For?

### 1. **Intelligent Drug Analysis**
![](https://i.imgur.com/JqZB6ah.png)
- Uses Agent AI's LLMs (like GPT-4) for deep molecular property evaluation.
- Understand complex drug-related queries in plain language.
- Offers recommendations based on real-time molecular and pharmacological data.

### 2. **Unified Drug Profiling**

![](https://i.imgur.com/UFNA4wk.png)
---
![](https://i.imgur.com/tVWpYUv.png)
---
![](https://i.imgur.com/Os5GF3Z.png)
- Combines essential tools in a single UI:
  - Lipinski’s Rule of Five
  - Binding affinity prediction
  - ADMET profiling
  - Drug-likeness metrics

### 3. **Interactive AI Consultation**
- Researchers can ask questions like:
  > "How can this drug candidate be improved for better absorption?"
- AI considers:
  - SMILES strings  
  - Target protein sequences  
  - Binding scores & ADMET properties  
  - Drug-likeness rules


---
### 4. **Accelerated Research Workflow**
- Saves hours of manual analysis.
- Provides quick, data-backed decisions.
- Enhances safety & efficacy validation using AI models.

---

# 🛠️ Technical Overview of [ Agent A I]

![](https://i.imgur.com/JqZB6ah.png)
<br/>
<br/>
![](https://i.imgur.com/sjEVdA4.png)

## 1. API Request Schema

```python
class AgentAIRequest(BaseModel):
    instructions: str
    drug_data: Dict[str, Any]
    llm_engine: str = "gpt4o"  # Default to GPT-4
```

- Ensures safe input validation
- Accepts user query and drug-specific parameters

---

## 2. Structured Context for AI

```python
full_instructions = f"""
Context: Analyzing drug with the following properties:
- Drug SMILES: {request.drug_data.get('drug_smiles')}
- Target Sequence: {request.drug_data.get('target_sequence')}
- Drug-likeness: {request.drug_data.get('drug_likeness')}
- Binding Score: {request.drug_data.get('binding_score')}
- ADMET Properties: {request.drug_data.get('admet')}

User Question: {request.instructions}
"""
```

- Ensures all relevant drug data is included
- Keeps AI responses focused and accurate

---

## 3. Agent AI API Integration

```python
@router.post("/agentai/")
async def ask_agent_ai(request: AgentAIRequest):
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "instructions": full_instructions,
        "llm_engine": request.llm_engine
    }
```

- Async endpoint for performance
- Secure API with structured payload

---

## 4. Robust Error Handling

```python
try:
    response = requests.post(API_URL, headers=headers, json=payload, timeout=30)
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.text)
except requests.exceptions.Timeout:
    raise HTTPException(status_code=504, detail="Request timed out")
```

- Manages timeouts and HTTP errors gracefully

---

## 5. Clean Response Structure

```python
return {
    "query": request.instructions,
    "context": request.drug_data,
    "analysis": response.json(),
    "message": "AI analysis completed successfully"
}
```

- Standardized and easy-to-debug response format

---

## 6. Example Input

```json
{
  "instructions": "Analyze this drug's properties and suggest improvements",
  "drug_data": {
    "drug_smiles": "CC1=C(C=C(C=C1)NC(=O)C2=CC=C(C=C2)CN3CCN(CC3)C)NC(=O)C4=CN=CC=C4",
    "target_sequence": "MRGPGAGVLVVGVGVGVGVGVGVGV",
    "drug_likeness": {
      "molecular_weight": 443.551,
      "logP": 3.642,
      "HBD": 2,
      "HBA": 5,
      "drug_likeness": "Pass"
    },
    "binding_score": 5.04,
    "admet": {
      "absorption": { "intestinal_absorption": "High" },
      "metabolism": { "risk_level": "Low" },
      "toxicity": { "risk_level": "Low" }
    }
  }
}
```

- Covers real-world drug data
- AI-ready format with SMILES, protein, ADMET, and more

Backend Repository Link : https://github.com/kshitijakarsh/backendDrug

Contributors: 

[Anubhav Singh]((https://github.com/AnubhavSingh99)
[Kshitij Akarsb]((https://github.com/kshitijakarsh)
