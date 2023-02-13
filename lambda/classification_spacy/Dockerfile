FROM public.ecr.aws/lambda/python:3.9-x86_64

RUN /var/lang/bin/python -m pip install --upgrade pip
# RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
# RUN yum -y install unzip
# RUN unzip awscliv2.zip
# RUN ./aws/install
# RUN aws s3 cp s3://amazon-textract-public-content/constructs/en_textcat_demo-0.0.0.tar.gz .

COPY en_textcat_demo-0.0.0.tar.gz ${LAMBDA_TASK_ROOT}/

RUN python -m pip install amazon-textract-idp-cdk-manifest ${LAMBDA_TASK_ROOT}/en_textcat_demo-0.0.0.tar.gz --target "${LAMBDA_TASK_ROOT}"

# Copy function code
COPY app/* ${LAMBDA_TASK_ROOT}/

# Set the CMD to your handler (could also be done as a parameter override outside of the Dockerfile)
CMD [ "sync_main.lambda_handler" ]
