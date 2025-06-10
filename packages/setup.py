from setuptools import find_packages, setup

setup(
    name="maze-packages",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        "pydantic>=2.0.0",
    ],
) 