import os
import shutil
import random

# Original dataset path
SOURCE_DIR = "../data"
# Target paths
TARGET_TRAIN = "../data_split/train"
TARGET_TEST = "../data_split/test"
SPLIT_RATIO = 0.8  # 80% train, 20% test

def create_dir(path):
    if not os.path.exists(path):
        os.makedirs(path)

def split_data():
    categories = os.listdir(SOURCE_DIR)
    for category in categories:
        source_path = os.path.join(SOURCE_DIR, category)
        if not os.path.isdir(source_path):
            continue

        files = os.listdir(source_path)
        random.shuffle(files)

        split_index = int(len(files) * SPLIT_RATIO)
        train_files = files[:split_index]
        test_files = files[split_index:]

        # Create train/test folders for the category
        train_category_path = os.path.join(TARGET_TRAIN, category)
        test_category_path = os.path.join(TARGET_TEST, category)
        create_dir(train_category_path)
        create_dir(test_category_path)

        # Copy files
        for file in train_files:
            shutil.copy(os.path.join(source_path, file), os.path.join(train_category_path, file))
        for file in test_files:
            shutil.copy(os.path.join(source_path, file), os.path.join(test_category_path, file))

        print(f"{category}: {len(train_files)} train, {len(test_files)} test")

if __name__ == "__main__":
    split_data()
