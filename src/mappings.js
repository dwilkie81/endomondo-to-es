export const mappings = {
    "properties" : {
      "altitude_max_m" : {
        "type" : "float"
      },
      "altitude_min_m" : {
        "type" : "float"
      },
      "ascend_m" : {
        "type" : "float"
      },
      "calories_kcal" : {
        "type" : "long"
      },
      "created_date" : {
        "type" : "date",
        "fields" : {
          "keyword" : {
            "type" : "keyword",
            "ignore_above" : 256
          }
        }
      },
      "descend_m" : {
        "type" : "float"
      },
      "distance_km" : {
        "type" : "float"
      },
      "duration_s" : {
        "type" : "long"
      },
      "end_time" : {
        "type" : "date",
        "fields" : {
          "keyword" : {
            "type" : "keyword",
            "ignore_above" : 256
          }
        }
      },
      "heart_rate_avg_bpm" : {
        "type" : "long"
      },
      "heart_rate_max_bpm" : {
        "type" : "long"
      },
      "hydration_l" : {
        "type" : "float"
      },
      "message" : {
        "type" : "text",
        "fields" : {
          "keyword" : {
            "type" : "keyword",
            "ignore_above" : 256
          }
        }
      },
      "name" : {
        "type" : "text",
        "fields" : {
          "keyword" : {
            "type" : "keyword",
            "ignore_above" : 256
          }
        }
      },
      "notes" : {
        "type" : "text",
        "fields" : {
          "keyword" : {
            "type" : "keyword",
            "ignore_above" : 256
          }
        }
      },
      "source" : {
        "type" : "text",
        "fields" : {
          "keyword" : {
            "type" : "keyword",
            "ignore_above" : 256
          }
        }
      },
      "speed_avg_kmh" : {
        "type" : "float"
      },
      "speed_max_kmh" : {
        "type" : "float"
      },
      "sport" : {
        "type" : "text",
        "fields" : {
          "keyword" : {
            "type" : "keyword",
            "ignore_above" : 256
          }
        }
      },
      "start_time" : {
        "type" : "date",
        "fields" : {
          "keyword" : {
            "type" : "keyword",
            "ignore_above" : 256
          }
        }
      },
      "tags" : {
        "type" : "text",
        "fields" : {
          "keyword" : {
            "type" : "keyword",
            "ignore_above" : 256
          }
        }
      }
    }
};