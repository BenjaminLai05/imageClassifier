# %% [markdown]
# # 1. Install Dependencies and Setup
import tensorflow as tf
import os
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Dense, Flatten, Dropout
import cv2
from PIL import Image

# %%

# %%

# %% [markdown]
# # 2. Removing Defective Images

# %%


# %%
data_dir = 'data'
image_exts = ['jpg', 'jpeg', 'png']

# %%
for image_class in os.listdir(data_dir):
    class_path = os.path.join(data_dir, image_class)

    if not os.path.isdir(class_path):
            continue
    
    for image in os.listdir(class_path):
        image_path = os.path.join(class_path, image)

        

        try:
            img = cv2.imread(image_path)

            with Image.open(image_path) as pil_img:
                tip = pil_img.format.lower() # Convert to lowercase
            if tip not in image_exts:
                print(f'Image not in ext list: {image_path} → Detected format: {tip}')
              # os.remove(image_path)

        except Exception as e:
            print('Issue with image: {}'.format(image_path))
          # os.remove(image_path)

# %% [markdown]
# # 3. Loading Data

# %%
import numpy as np
from matplotlib import pyplot as plt

# %%
data = tf.keras.utils.image_dataset_from_directory('data')

# %%
data_iterator = data.as_numpy_iterator()
batch = data_iterator.next()


# %%
fig, ax = plt.subplots(ncols=4, figsize=(20,20))
for idx, img in enumerate(batch[0][:4]):
    ax[idx].imshow(img.astype(int))
    ax[idx].title.set_text(batch[1][idx])

# %% [markdown]
# # 4. Scale Data

# %%
data = data.map(lambda x,y: (x/255, y))

# %%
data.as_numpy_iterator().next()

# %% [markdown]
# # 5. Split Data

# %%
total = len(data)
train_size = int(total * 0.7) # 5
val_size = int(len(data) * .15) # 1
test_size = total - train_size - val_size # 2

# %%
train = data.take(train_size)
val = data.skip(train_size).take(val_size)
test = data.skip(train_size + val_size).take(test_size)

# %% [markdown]
# # 6. Build Deep Learning Model

# %%


# %%
model = Sequential()

# %%
model.add(Conv2D(16, (3,3), 1, activation='relu', input_shape=(256, 256, 3)))
model.add(MaxPooling2D())
model.add(Conv2D(32, (3,3), 1, activation='relu'))
model.add(MaxPooling2D())
model.add(Conv2D(16, (3,3), 1, activation='relu'))
model.add(MaxPooling2D())
model.add(Flatten())
model.add(Dense(256, activation='relu'))
model.add(Dense(1, activation='sigmoid'))

# %%
model.compile('adam', loss=tf.losses.BinaryCrossentropy(), metrics=['accuracy'])

# %%
model.summary()


# %% [markdown]
# 

# %% [markdown]
# # 7. Train

# %%
logdir='logs'

# %%
tensorboard_callback = tf.keras.callbacks.TensorBoard(log_dir=logdir)
hist = model.fit(train, epochs=20, validation_data=val, callbacks=[tensorboard_callback])

# %% [markdown]
# 

# %% [markdown]
# # 8. Plot Performance

# %%
fig = plt.figure()
plt.plot(hist.history['loss'], color='teal', label='loss')
plt.plot(hist.history['val_loss'], color='orange', label='val_loss')
fig.suptitle('Loss', fontsize=20)
plt.legend(loc="upper left")
plt.show()

# %%
fig = plt.figure()
plt.plot(hist.history['accuracy'], color='teal', label='accuracy')
plt.plot(hist.history['val_accuracy'], color='orange', label='val_accuracy')
fig.suptitle('Accuracy', fontsize=20)
plt.legend(loc="upper left")
plt.show()

# %% [markdown]
# # 9. Evaluate

# %%
from tensorflow.keras.metrics import Precision, Recall, BinaryAccuracy  

# %%
pre = Precision()
re = Recall()
acc = BinaryAccuracy()

# %%
for batch in test.as_numpy_iterator():
    X, y = batch
    yhat = model.predict(X)
    pre.update_state(y, yhat)
    re.update_state(y, yhat)
    acc.update_state(y, yhat)

# %%
print(pre.result(), re.result(), acc.result())

# %% [markdown]
# # 10. Test

# %%
import cv2

# %%
img = cv2.imread('data/no/No 6.jpg')
plt.imshow(img)
plt.show()

# %% [markdown]
# 

# %%
resize = tf.image.resize(img, (256,256))
plt.imshow(resize.numpy().astype(int))
plt.show()

# %%
yhat = model.predict(np.expand_dims(resize/255, 0))

# %%
yhat

# %%
if yhat > 0.5: 
    print(f'The Predicted Class is No.')
else:
    print(f'The Predicted Class is Yes. ')

# %% [markdown]
# # 11. Saving The Model

# %% [markdown]
# 


