import logging
from flask import Blueprint,jsonify,request
from .ai_service import generate_response
from .availability import check_availability
logger=logging.getLogger(__name__)
api=Blueprint("api",__name__)
@api.get("/health")
def health(): return jsonify({"status":"ok","service":"hotel-guest-assistant-backend"})
@api.post("/chat")
def chat():
    data=request.get_json(silent=True) or {}; message=data.get("message"); conversation=data.get("conversation",[])
    if not isinstance(message,str) or not message.strip(): return jsonify({"error":"Message is required."}),400
    if not isinstance(conversation,list): return jsonify({"error":"Conversation must be an array."}),400
    return jsonify({"message":generate_response(message.strip(),conversation)})
@api.post("/availability")
def availability():
    data=request.get_json(silent=True) or {}
    if not data.get("check_in") or not data.get("check_out") or data.get("adults") is None: return jsonify({"error":"check_in, check_out, and adults are required."}),400
    try: return jsonify(check_availability(data["check_in"],data["check_out"],int(data["adults"])))
    except ValueError as e: return jsonify({"error":str(e)}),400
    except Exception:
        logger.exception("Availability service failed")
        return jsonify({"error":"We could not check availability right now. Please try again."}),500
