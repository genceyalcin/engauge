from google.cloud import vision
import io

client = vision.ImageAnnotatorClient()

def detect_faces(path):
    with io.open(path, 'rb') as image_file:
        content = image_file.read()

    image = vision.Image(content=content)

    response = client.face_detection(image=image)
    face = response.face_annotations[0]

    # Names of likelihood from google.cloud.vision.enums
    likelihood_name = ('UNKNOWN', 'VERY_UNLIKELY', 'UNLIKELY', 'POSSIBLE',
                       'LIKELY', 'VERY_LIKELY')

    return {
        "anger": likelihood_name[face.anger_likelihood],
        "joy": likelihood_name[face.joy_likelihood],
        "surprise": likelihood_name[face.surprise_likelihood],
        "sorrow": likelihood_name[face.sorrow_likelihood]
    }
