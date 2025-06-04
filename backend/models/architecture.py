import torch
import torch.nn as nn

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