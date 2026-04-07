import json

def analyze_ips_logs(log_data):
    """Sessiz Olum IPS Log Analyzer"""
    suspicious_ips = [log['ip'] for log in log_data if log['attempts'] > 3]
    return f"Detected {len(suspicious_ips)} malicious actors."

if __name__ == "__main__":
    print("--- [Sessiz Olum] Security Analysis Module Loaded ---")
