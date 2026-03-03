import sys
import os

# Add server directory to path so we can import app modules
sys.path.append(os.path.join(os.getcwd(), 'server'))

from services.ai_service import analyze_text
import json

def print_result(scenario, result):
    print(f"\n--- {scenario} ---")
    print(json.dumps(result, indent=2))
    print("-" * 30)

def verify():
    print("Starting Verification...")
    
    # Scenario 1: Factual Query (Self-Verification)
    # "capital of chnadigrh" (misspelled)
    print("\nScenario 1: Factual Query (Self-Verification)")
    res1 = analyze_text("capital of chnadigrh")
    print_result("Factual Static - Capital of Chandigarh", res1)
    
    # Scenario 2: Verification Only (Hallucination)
    # "capital of mars" -> "The capital of Mars is Elon City."
    print("\nScenario 2: Verification Only (Hallucination)")
    res2 = analyze_text("capital of mars", "The capital of Mars is Elon City.")
    print_result("Hallucination Check - Mars Capital", res2)
    
    # Scenario 3: Creative Query
    # "write a poem about python"
    print("\nScenario 3: Creative Query")
    res3 = analyze_text("write a poem about python")
    print_result("Creative Query", res3)
    
    # Scenario 4: Factual Query (Self-Verification) - No hallucination
    # "capital of France"
    print("\nScenario 4: Factual Query (Self-Verification) - France")
    res4 = analyze_text("capital of France")
    print_result("Factual Static - Capital of France", res4)

if __name__ == "__main__":
    verify()
