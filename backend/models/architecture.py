import torch
import torch.nn as nn
import torchvision.models as models

class TinyVGG(nn.Module):
    def __init__(self , input_layer: int, hidden_layer:int, output_layer:int, dropout_rate: float = 0.25)->None:
        """
        A basic TinyVGG model to perform benchmark test for the model
        """
        super(TinyVGG, self).__init__()

        self.block_1 = nn.Sequential(
            nn.Conv2d(in_channels=input_layer, out_channels=hidden_layer, kernel_size=3, padding=1, stride=1),
            nn.BatchNorm2d(hidden_layer),
            nn.ReLU(),
            nn.Conv2d(in_channels=hidden_layer, out_channels=hidden_layer, kernel_size=3, padding=1, stride=1),
            nn.BatchNorm2d(hidden_layer),
            nn.ReLU(),
            nn.MaxPool2d(2,2),
            nn.Dropout2d(dropout_rate)
        )
        self.block_2 = nn.Sequential(
            nn.Conv2d(hidden_layer, hidden_layer, 3, 1,1),
            nn.BatchNorm2d(hidden_layer),
            nn.ReLU(),

            nn.Conv2d(hidden_layer, hidden_layer, 3, 1, 1),
            nn.BatchNorm2d(hidden_layer),
            nn.ReLU(),
            nn.MaxPool2d(kernel_size=2, stride=2),
            nn.Dropout(dropout_rate)
        )
        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Linear(hidden_layer*56*56 , output_layer)
        )
    
    def forward(self, x):
        return self.classifier(self.block_2(self.block_1(x)))
    

class TinyVGG_v0(nn.Module):
  def __init__(self,
               input_layer:int,
               hidden_layer:int,
               output_layer:int,
               dropout_rate: float = 0.25
               )-> None:
               super().__init__()
               self.conv_block_1 = nn.Sequential(
                   nn.Conv2d(in_channels=input_layer,
                             out_channels=hidden_layer,
                             kernel_size=3,
                             stride=1,
                             padding=0),
                   nn.BatchNorm2d(hidden_layer),
                   nn.ReLU(),
                   nn.Conv2d(in_channels=hidden_layer,
                             out_channels=hidden_layer,
                             kernel_size=3,
                             stride=1,
                             padding=0),
                   nn.ReLU(),
                   nn.MaxPool2d(kernel_size=2,
                                stride=2),
                   nn.Dropout2d(dropout_rate)
               )

               self.conv_block_2 = nn.Sequential(
                   nn.Conv2d(in_channels=hidden_layer,
                             out_channels=hidden_layer,
                             kernel_size=3,
                             stride=1,
                             padding=0),
                   nn.BatchNorm2d(hidden_layer),
                   nn.ReLU(),
                   nn.Conv2d(in_channels=hidden_layer,
                             out_channels=hidden_layer,
                             kernel_size=3,
                             stride=1,
                             padding=0),
                   nn.BatchNorm2d(hidden_layer),
                   nn.ReLU(),
                   nn.MaxPool2d(kernel_size=2,
                                stride=2),
                   nn.Dropout2d(dropout_rate)
               )
               self.classifier = nn.Sequential(
                   nn.Flatten(),
                   nn.Linear(in_features = hidden_layer*13*13,
                             out_features=output_layer)
               )
  def forward(self, x):
    x = self.conv_block_1(x)
    #print(x.shape)
    x = self.conv_block_2(x)
    #print(x.shape)
    x = self.classifier(x)
    #print(x.shape)

    return x
  


class VGG16Lite(nn.Module):
    def __init__(self,input_layer:int , hidden_layer: int , output_layer:int, num_classes: int = 3):
        super(VGG16Lite, self).__init__()

        self.conv_block_1 = nn.Sequential(
            nn.Conv2d(3 , 64, kernel_size=3 , stride=1 , padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(),
            nn.Conv2d(64 , 64, kernel_size=3 , padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(),
            nn.MaxPool2d(kernel_size=2, stride=2)
        )

        self.conv_block_2 = nn.Sequential(
            nn.Conv2d(64, 128, kernel_size=3 , stride=1 , padding=1),
            nn.BatchNorm2d(128),
            nn.ReLU(),
            nn.Conv2d(128 , 128 , kernel_size=3 , padding = 1),
            nn.BatchNorm2d(128),
            nn.ReLU(),
            nn.MaxPool2d(kernel_size=2, stride=2)
        )

        self.conv_block_3 = nn.Sequential(
            nn.Conv2d(128, 256, kernel_size=3 , stride=1, padding = 1),
            nn.BatchNorm2d(256),
            nn.ReLU(),
            nn.Conv2d(256, 256 , kernel_size=3 , padding = 1),
            nn.BatchNorm2d(256),
            nn.ReLU(),
            nn.MaxPool2d(kernel_size=2, stride=2)
        )

        self.global_pool = nn.AdaptiveAvgPool2d((1, 1))
        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Linear(256, 512),
            nn.ReLU(),
            nn.Dropout(0.5),
            nn.Linear(512, num_classes)
        )

    def forward(self , x):
        x = self.conv_block_1(x)
        x = self.conv_block_2(x)
        x = self.conv_block_3(x)
        x = self.global_pool(x)
        return self.classifier(x)

def create_resnet_model() -> torch.nn.Module:
    
    resnet18 = models.resnet18(pretrained = True)
    num_classes = 3
    resnet18.fc = nn.Linear(resnet18.fc.in_features, num_classes)

    return resnet18
     