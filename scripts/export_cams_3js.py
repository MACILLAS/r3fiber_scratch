import numpy as np
from scipy.spatial.transform import Rotation
from read_write_model import read_model
import json

class Model:
    def __init__(self):
        self.cameras = []
        self.images = []
        self.points3D = []

    def read_model(self, path, ext=""):
        self.cameras, self.images, self.points3D = read_model(path, ext)

def colmap_to_threejs_euler(position, quaternion):
    """
    Converts COLMAP pose (world-to-camera) to Three.js compatible camera-to-world position and Euler angles.

    Args:
        position (list): [tx, ty, tz], translation vector in COLMAP.
        quaternion (list): [qw, qx, qy, qz], quaternion in COLMAP

    Returns:
        t (list): Three.js compatible translation vector.
        euler_angles (list): Three.js compatible Euler angles (in radians).
    """
    # Convert quaternion to rotation matrix (world-to-camera)
    R_wc = qvec2rotmat(quaternion)

    # Invert the rotation and translation (camera-to-world)
    R_cw = R_wc.T
    t_cw = -R_cw @ position

    euler = Rotation.from_matrix(R_cw).as_euler('xyz', degrees=False)
    euler = [-euler[0], euler[1], euler[2]]
    return t_cw, euler

def qvec2rotmat(qvec):
    return np.array(
        [
            [
                1 - 2 * qvec[2] ** 2 - 2 * qvec[3] ** 2,
                2 * qvec[1] * qvec[2] - 2 * qvec[0] * qvec[3],
                2 * qvec[3] * qvec[1] + 2 * qvec[0] * qvec[2],
            ],
            [
                2 * qvec[1] * qvec[2] + 2 * qvec[0] * qvec[3],
                1 - 2 * qvec[1] ** 2 - 2 * qvec[3] ** 2,
                2 * qvec[2] * qvec[3] - 2 * qvec[0] * qvec[1],
            ],
            [
                2 * qvec[3] * qvec[1] - 2 * qvec[0] * qvec[2],
                2 * qvec[2] * qvec[3] + 2 * qvec[0] * qvec[1],
                1 - 2 * qvec[1] ** 2 - 2 * qvec[2] ** 2,
            ],
        ]
    )


def main():
    images = []

    # read COLMAP model
    model = Model()
    model.read_model("./sparse/0/", ext=".txt")

    for img in model.images.values():
        position, euler_angles = colmap_to_threejs_euler(img.tvec, img.qvec)
        images.append({'id': img.id, 'position': list(position), 'rotation': list(euler_angles)})


    with open("mydata.json", "w") as fout:
        json.dump(images, fout, indent=1)


if __name__ == "__main__":
    main()
