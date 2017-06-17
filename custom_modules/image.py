import os
import math
import shutil
from PIL import Image
from watson_developer_cloud import VisualRecognitionV3
watson = VisualRecognitionV3('2016-05-20',
                             api_key=os.environ['API_KEY'])
def api():
    return dir(watson)
def docs():
    help(VisualRecognitionV3)

class DataSet:
    def __init__(self, path):
        self.memory = []
        self.children = []
        self.path = os.path.abspath(path)
        self.basename = os.path.basename(self.path)
    def populate(self):
        for root, dirs, files in os.walk(self.path):
            if (root == self.path):
                self.children.extend(list(map(
                    lambda ch: os.path.join(self.path, ch), dirs)))
                continue
            self.memory.append(ImageSet(root, files))
        return self
    def get_names(self):
        return list(map(lambda s: os.path.basename(s).replace('_', ' '),
                        self.children))

class ImageSet(DataSet):
    def __init__(self, root, files):
        super().__init__(root)
        self.children.extend(list(map(
            lambda f: os.path.join(root, f), files[1:])))
    def populate(self):
        for f in self.children:
            image = Image.open(f)
            self.memory.append(image)
        del image
        return self

class ImageProcessor:
    def __init__(self, data_set, output_path):
        self.memory = []
        self.data_set = data_set[:]
        self.output_path = output_path

    def gen_tree(self):
        os.mkdir(self.output_path)
        for image_set in self.data_set:
            os.mkdir(os.path.join(self.output_path,
                                  image_set.basename))
        os.mkdir(os.path.join(self.output_path, 'zips'))

    def conform(self, image, max_w):
        w, h = image.size
        if w >= max_w:
            new_size = max_w, math.floor(h * (max_w / w))
            return image.resize(new_size)
        else:
            return image

    def read_dimensions(self):
        result = []
        for image_set in self.data_set:
            for child in image_set.children:
                image = Image.open(child)
                result.append(image.size)
                image.close()
        return sorted(result)

    def batch_conform(self, max_w, kind='jpeg'):
        for image_set in self.data_set:
            destination = os.path.join(self.output_path,
                                       image_set.basename)
            for child in image_set.children:
                image = Image.open(child)
                filename = os.path.basename(image.filename)
                self.conform(image, max_w).save(os.path.join(destination, filename), kind)
                image.close()

    def batch_compress(self):
        for image_set in self.data_set:
            base = os.path.join(self.output_path,
                                'zips', image_set.basename)
            root = os.path.join(self.output_path,
                                image_set.basename)
            shutil.make_archive(base, 'zip', root)

if __name__ == '__main__':
    import sys
#
