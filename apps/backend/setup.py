from setuptools import find_packages, setup

setup(
    name="maze-backend",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        "fastapi>=0.100.0",
        "uvicorn>=0.22.0",
        "pydantic>=2.0.0",
    ],
) 