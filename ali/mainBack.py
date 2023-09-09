from email.header import decode_header
import imaplib
import email
import datetime
import yaml

with open("creds.yml") as f:
    content = f.read()

my_credentials = yaml.load(content, Loader=yaml.FullLoader)

user, password = my_credentials["user"], my_credentials["password"]


#connecting to gmail 
imap = imaplib.IMAP4_SSL('imap.gmail.com')

key = "ON"
date = datetime.date.today().strftime("%d-%b-%Y")
imap.login('itsali49365@gmail.com', 'rkuj bwor ehdn nsem')

status, messages = imap.select('INBOX')
#stores every single email in a tuple
typ, data = imap.search(None, 'ON', date)
messages = data[0].split()

for message in messages:
    res, msg = imap.fetch(message, '(RFC822)')
    for response in msg:
        if isinstance(response, tuple):
            msg = email.message_from_bytes(response[1])
            subject, encoding = decode_header(msg['Subject'])[0]
            if isinstance(subject, bytes) and encoding != None:
                subject= subject.decode(encoding)
            From, encoding = decode_header(msg['From'])[0]
            if isinstance(From, bytes) and From != None:
                From = From.decode(encoding)
            print("SUBJECT: ", subject)
            print("FROM: ", From)
            if msg.is_multipart():
                for part in msg.walk():
                    content_type = part.get_content_type()
                    content_disposition = str(part.get("Content-Disposition"))
                    try:
                        body= part.get_payload(decode=True).decode("utf-8")
                    except:
                        pass
                    if content_type == "text/plain":
                        print(body)
            else:
                content_type = msg.get_content_type()
                body = msg.get_payload(decode=True).decode("utf-8")
                if content_type == "text/plain":
                    print(body)




imap.close()
imap.logout()


#SECOND

# import imaplib
# import email
# from email.header import decode_header
# import os

# imap = imaplib.IMAP4_SSL("imap.gmail.com")  # establish connection

# imap.login("itsali49365@gmail.com", "rkuj bwor ehdn nsem")  # login

# #print(imap.list())  # print various inboxes
# status, messages = imap.select("INBOX")  # select inbox

# numOfMessages = int(messages[0]) # get number of messages


# def clean(text):
#     # clean text for creating a folder
#     return "".join(c if c.isalnum() else "_" for c in text)

# def obtain_header(msg):
#     # decode the email subject
#     subject, encoding = decode_header(msg["Subject"])[0]
#     if isinstance(subject, bytes):
#         subject = subject.decode(encoding)

#     # decode email sender
#     From, encoding = decode_header(msg.get("From"))[0]
#     if isinstance(From, bytes):
#         From = From.decode(encoding)

#     print("Subject:", subject)
#     print("From:", From)
#     return subject, From

# for i in range(numOfMessages, numOfMessages - 9, -1):
#     res, msg = imap.fetch(str(i), "(RFC822)")  # fetches the email using it's ID

#     for response in msg:
#         if isinstance(response, tuple):
#             msg = email.message_from_bytes(response[1])

#             subject, From = obtain_header(msg)

#             if msg.is_multipart():
#                 # iterate over email parts
#                 for part in msg.walk():
#                     # extract content type of email
#                     content_type = part.get_content_type()
#                     content_disposition = str(part.get("Content-Disposition"))

#                     try:
#                         body = part.get_payload(decode=True).decode()
#                     except:
#                         pass

#                     if content_type == "text/plain" and "attachment" not in content_disposition:
#                         print(body)
                    
#             else:
#                 # extract content type of email
#                 content_type = msg.get_content_type()
#                 # get the email body
#                 body = msg.get_payload(decode=True).decode()
#                 if content_type == "text/plain":
#                     print(body)

#             print("="*100)

# imap.close()